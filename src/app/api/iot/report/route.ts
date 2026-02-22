
import { NextRequest, NextResponse } from 'next/server';
import { generateCivicIssueReport } from '@/ai/flows/generate-civic-issue-report';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, limit } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

// ----------------------------------------------------------------------------
// Validation & Types
// ----------------------------------------------------------------------------

interface IotReportRequest {
    deviceId: string;
    location: {
        lat: number;
        lng: number;
    };
    image: string; // Base64 Data URI
}

function isValidRequest(body: any): body is IotReportRequest {
    return (
        typeof body.deviceId === 'string' &&
        body.location &&
        typeof body.location.lat === 'number' &&
        typeof body.location.lng === 'number' &&
        typeof body.image === 'string'
    );
}

interface AnalysisResult {
    issueType: string;
    severity: 'Low' | 'Medium' | 'High';
    aiDescription: string;
}

// ----------------------------------------------------------------------------
// Firebase Initialization (Server-Side compatible)
// ----------------------------------------------------------------------------
function getFirebase() {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return {
        db: getFirestore(app),
        storage: getStorage(app),
    };
}

// ----------------------------------------------------------------------------
// Upload image to Firebase Storage, return public download URL
// ----------------------------------------------------------------------------
async function uploadImageToStorage(
    storage: ReturnType<typeof getStorage>,
    deviceId: string,
    imageDataUri: string
): Promise<string> {
    const timestamp = Date.now();
    const filename = `iot-reports/${deviceId}/${timestamp}.jpg`;
    const storageRef = ref(storage, filename);

    // uploadString handles base64 Data URIs directly
    await uploadString(storageRef, imageDataUri, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
}

// ----------------------------------------------------------------------------
// POST Handler
// ----------------------------------------------------------------------------
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 1. Validate Input
        if (!isValidRequest(body)) {
            return NextResponse.json(
                { success: false, error: 'Invalid payload. Required: deviceId, location{lat,lng}, image' },
                { status: 400 }
            );
        }

        // 2. AI Analysis
        let analysis: AnalysisResult;
        try {
            analysis = await generateCivicIssueReport({
                photoDataUri: body.image,
                location: body.location
            }) as AnalysisResult;
        } catch (aiError) {
            console.warn("AI Analysis failed (likely billing/quota), using fallback:", aiError);
            analysis = {
                issueType: 'Unclassified',
                severity: 'Medium' as const,
                aiDescription: 'Automated fallback report: AI service unavailable. Manual review required.'
            };
        }

        const { db, storage } = getFirebase();
        const reportsRef = collection(db, 'reports');

        // 3. Deduplication Check — keep only the FIRST report per device+issue
        if (analysis.issueType !== 'No Issues') {
            try {
                const q = query(
                    reportsRef,
                    where('deviceId', '==', body.deviceId),
                    where('issueType', '==', analysis.issueType),
                    where('status', 'in', ['Submitted', 'In Progress']),
                    limit(1)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const existingDoc = snapshot.docs[0];
                    return NextResponse.json({
                        success: true,
                        reportId: existingDoc.id,
                        message: 'Duplicate incident detected. First report retained.',
                        analysis,
                        isDuplicate: true
                    });
                }
            } catch (dedupError) {
                console.warn("Deduplication check failed, proceeding with new report:", dedupError);
            }
        }

        // 4. Upload image to Firebase Storage → get a permanent URL
        let imageUrl: string;
        try {
            imageUrl = await uploadImageToStorage(storage, body.deviceId, body.image);
            console.log(`Image uploaded to Storage: ${imageUrl}`);
        } catch (storageError) {
            console.warn("Firebase Storage upload failed, falling back to base64 inline:", storageError);
            // Fallback: store base64 inline if Storage upload fails (not ideal but keeps data)
            imageUrl = body.image;
        }

        // 5. Save metadata (+ Storage URL) to Firestore
        const reportData = {
            issueType: analysis.issueType,
            severity: analysis.severity,
            aiDescription: analysis.aiDescription,
            imageUrl,                              // ← Now a Firebase Storage URL, not raw base64
            location: body.location,
            userId: 'IOT_DEVICE',
            userFullName: `IoT Device (${body.deviceId})`,
            deviceId: body.deviceId,
            source: 'IOT',
            createdAt: new Date().toISOString(),
            status: 'Submitted',
            upvoteCount: 0,
            imageHint: 'iot-capture'
        };

        const docRef = await addDoc(reportsRef, reportData);

        return NextResponse.json({
            success: true,
            reportId: docRef.id,
            imageUrl,
            analysis
        });

    } catch (error: any) {
        console.error('IoT Report Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
