'use client';

import { useState, useEffect } from 'react';
import { CameraFeedCard } from './camera-feed-card';
import { LiveView } from './live-view';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Report, IoTReport } from '@/lib/types';
import { Camera, RefreshCw, Filter, Map as MapIcon, Grid, AlertTriangle, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./map-view'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-xl">Loading Map...</div>
});

type ViewMode = 'grid' | 'live' | 'map';

export function SurveillanceDashboard() {
    const firestore = useFirestore();
    const [reports, setReports] = useState<IoTReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('live');

    useEffect(() => {
        if (!firestore) return;

        const q = query(
            collection(firestore, 'reports'),
            where('userId', '==', 'IOT_DEVICE'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReports: IoTReport[] = snapshot.docs.map(docSnap => {
                const data = docSnap.data() as Report & { deviceId?: string; aiDescription?: string };
                return {
                    id: docSnap.id,
                    deviceId: data.deviceId || 'CAM-01',
                    deviceName: data.userFullName || 'Public Cam',
                    location: data.location,
                    issueType: data.issueType,
                    severity: data.severity,
                    confidenceScore: 0.95,
                    imageUrl: data.imageUrl,
                    aiDescription: data.aiDescription,          // ← Gemini description
                    detectedAt: data.createdAt,
                    status: data.status === 'Resolved' ? 'Resolved' : 'Unresolved'
                };
            });
            setReports(fetchedReports);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching surveillance feeds:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [firestore]);

    const handleDelete = async (reportId: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'reports', reportId));
        } catch (err) {
            console.error('Failed to delete report:', err);
        }
    };

    const filteredReports = reports.filter(r => {
        if (filter === 'all') return true;
        if (filter === 'issues') return r.issueType !== 'No Issues';
        if (filter === 'clean') return r.issueType === 'No Issues';
        return r.issueType === filter;
    });

    const activeIssuesCount = reports.filter(r => r.issueType !== 'No Issues').length;

    const viewButtons: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
        { mode: 'live', icon: <Radio className="w-4 h-4" />, label: 'Live' },
        { mode: 'grid', icon: <Grid className="w-4 h-4" />, label: 'Grid' },
        { mode: 'map', icon: <MapIcon className="w-4 h-4" />, label: 'Map' },
    ];

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-4 rounded-lg border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Cameras</p>
                        <h3 className="text-2xl font-bold">{reports.length}</h3>
                    </div>
                    <Camera className="w-8 h-8 text-primary/20" />
                </div>
                <div className="bg-card p-4 rounded-lg border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Issues Detected</p>
                        <h3 className="text-2xl font-bold text-red-600">{activeIssuesCount}</h3>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-500/20" />
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter Feeds" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Feeds</SelectItem>
                            <SelectItem value="issues">Only Issues</SelectItem>
                            <SelectItem value="clean">Clear Roads</SelectItem>
                            <SelectItem value="Garbage Overflow">Garbage</SelectItem>
                            <SelectItem value="Pothole">Potholes</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        title="Refresh Feeds"
                        onClick={() => setLoading(l => !l)}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* View mode toggle */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                    {viewButtons.map(({ mode, icon, label }) => (
                        <Button
                            key={mode}
                            variant={viewMode === mode ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode(mode)}
                            className="gap-2"
                        >
                            {icon}
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Live View */}
            {viewMode === 'live' && (
                <div className="animate-in fade-in-50 duration-500">
                    <LiveView reports={filteredReports} />
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in-50 duration-500">
                    {filteredReports.map(report => (
                        <CameraFeedCard key={report.id} report={report} onDelete={handleDelete} />
                    ))}
                    {filteredReports.length === 0 && (
                        <div className="col-span-full py-20 text-center text-muted-foreground">
                            No feeds match your filter.
                        </div>
                    )}
                </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
                <div className="h-[600px] w-full rounded-xl border border-muted shadow-sm overflow-hidden z-0 animate-in fade-in-50 duration-500">
                    <MapView reports={filteredReports} />
                </div>
            )}
        </div>
    );
}
