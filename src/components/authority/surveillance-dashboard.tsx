'use client';

import { useState, useEffect } from 'react';
import { CameraFeedCard } from './camera-feed-card';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Report, IoTReport, IoTDevice } from '@/lib/types';
// import { getMockIoTFeeds, getMockIoTDevices } from '@/lib/mock-iot-data'; // No longer needed
import { Camera, RefreshCw, Filter, Layers, Map as MapIcon, Grid, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./map-view'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-xl">Loading Map...</div>
});

export function SurveillanceDashboard() {
    const firestore = useFirestore();
    const [reports, setReports] = useState<IoTReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

    const fetchFeeds = async () => {
        // No-op: handled by snapshot listener
    };

    useEffect(() => {
        if (!firestore) return;

        // Subscribe to Firestore "reports" collection
        // In a real app, you might want to filter this more heavily
        const q = query(
            collection(firestore, 'reports'),
            where('userId', '==', 'IOT_DEVICE'), // Or just show all? The requirement says IOT devices, but usually "Surveillance" implies automated feeds. Let's stick to IOT_DEVICE for strict surveillance view, or maybe all active reports? The previous discussion implied IOT.
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReports: IoTReport[] = snapshot.docs.map(doc => {
                const data = doc.data() as Report; // Cast to base Report first
                return {
                    id: doc.id,
                    deviceId: data.userId === 'IOT_DEVICE' ? 'CAM-01' : (data.userId || 'Unknown'), // Mock device ID if just 'IOT_DEVICE' string
                    deviceName: data.userFullName || 'Public Cam',
                    location: data.location,
                    issueType: data.issueType,
                    severity: data.severity,
                    confidenceScore: 0.95, // Mock score if not in DB
                    imageUrl: data.imageUrl,
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

    const filteredReports = reports.filter(r => {
        if (filter === 'all') return true;
        if (filter === 'issues') return r.issueType !== 'No Issues';
        if (filter === 'clean') return r.issueType === 'No Issues';
        return r.issueType === filter;
    });

    const activeIssuesCount = reports.filter(r => r.issueType !== 'No Issues').length;

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
                    <AlertTriangleIcon className="w-8 h-8 text-red-500/20" />
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
                    <Button variant="outline" size="icon" onClick={fetchFeeds} title="Refresh Feeds">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                <div className="flex items-center gap-2 bg-muted p-1 rounded-md">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="gap-2"
                    >
                        <Grid className="w-4 h-4" />
                        Grid
                    </Button>
                    <Button
                        variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('map')}
                        className="gap-2"
                    >
                        <MapIcon className="w-4 h-4" />
                        Map
                    </Button>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in-50 duration-500">
                    {filteredReports.map(report => (
                        <CameraFeedCard key={report.id} report={report} />
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
                <div className="h-[600px] w-full rounded-xl border border-muted shadow-sm overflow-hidden z-0">
                    <MapView reports={filteredReports} />
                </div>
            )}
        </div>
    );
}

function AlertTriangleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    )
}
