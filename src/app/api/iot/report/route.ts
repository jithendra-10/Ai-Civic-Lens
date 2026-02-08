
import { NextRequest, NextResponse } from 'next/server';
import { generateCivicIssueReport } from '@/ai/flows/generate-civic-issue-report';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, limit, updateDoc, doc } from 'firebase/firestore';
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
// We re-initialize here because the main @/firebase/index might be 'use client'
function getFirebase() {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return getFirestore(app);
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
        // Note: generateCivicIssueReport expects { photoDataUri, location }
        let analysis: AnalysisResult;
        try {
            analysis = await generateCivicIssueReport({
                photoDataUri: body.image,
                location: body.location
            });
        } catch (aiError) {
            console.warn("AI Analysis failed (likely billing/quota), using fallback:", aiError);
            analysis = {
                issueType: 'Pothole', // Fallback
                severity: 'Medium' as 'Medium',
                aiDescription: 'Automated fallback report: AI service unavailable. Possible road issue detected.'
            };
        }

        // 3. Save to Firestore
        const db = getFirebase();
        const reportsRef = collection(db, 'reports');

        // --- DEDUPLICATION CHECK ---
        // Check if this device already has an active report for this issue type
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
                    // Duplicate found! Update the existing report's "lastSeen" instead of creating a new one
                    const existingDoc = snapshot.docs[0];
                    await updateDoc(doc(db, 'reports', existingDoc.id), {
                        lastSeenAt: new Date().toISOString(),
                    });

                    return NextResponse.json({
                        success: true,
                        reportId: existingDoc.id,
                        message: 'Duplicate incident detected. Updated existing active report.',
                        analysis,
                        isDuplicate: true
                    });
                }
            } catch (dedupError) {
                console.warn("Deduplication check failed (likely permissions), proceeding with new report creation:", dedupError);
                // Proceed to create new report anyway
            }
        }
        // ---------------------------
        // (reportsRef already defined above)


        const reportData = {
            issueType: analysis.issueType,
            severity: analysis.severity,
            aiDescription: analysis.aiDescription,
            imageUrl: body.image, // In production, we should upload to Storage and save URL.
            location: body.location,
            userId: 'IOT_DEVICE', // Matches the backdoor rule we added
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
