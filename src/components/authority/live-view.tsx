'use client';

import { IoTReport } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, MapPin, Bot, AlertTriangle, CheckCircle, ImageOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface LiveViewProps {
    reports: IoTReport[];
}

const severityColors: Record<string, string> = {
    High: 'border-red-500 bg-red-50 dark:bg-red-950/20',
    Medium: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
    Low: 'border-green-500 bg-green-50 dark:bg-green-950/20',
};

export function LiveView({ reports }: LiveViewProps) {
    const [selected, setSelected] = useState<number>(0);

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-72 gap-3 text-muted-foreground">
                <Camera className="w-12 h-12 opacity-20" />
                <p className="text-sm">No camera feeds available yet.</p>
                <p className="text-xs opacity-70">Feeds will appear here once your ESP32-CAM sends a report.</p>
            </div>
        );
    }

    const activeReport = reports[selected];
    const isIssue = activeReport?.issueType !== 'No Issues';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main viewer */}
            <div className="lg:col-span-3 space-y-3">
                <div className={`relative rounded-xl overflow-hidden border-2 ${isIssue ? (activeReport.severity === 'High' ? 'border-red-500' : 'border-yellow-500') : 'border-green-500'} shadow-lg bg-black`}>
                    {/* LIVE badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-mono font-bold">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                        LIVE FEED
                    </div>

                    {/* Issue badge */}
                    <div className="absolute top-3 right-3 z-10">
                        <Badge variant={isIssue ? 'destructive' : 'outline'} className="text-xs font-semibold px-3">
                            {activeReport.issueType}
                        </Badge>
                    </div>

                    {/* Main image */}
                    {activeReport.imageUrl ? (
                        <img
                            src={activeReport.imageUrl}
                            alt={activeReport.issueType}
                            className="w-full aspect-video object-cover"
                        />
                    ) : (
                        <div className="w-full aspect-video flex flex-col items-center justify-center gap-3 text-muted-foreground">
                            <ImageOff className="w-12 h-12 opacity-25" />
                            <span className="text-sm">No image captured</span>
                        </div>
                    )}

                    {/* Bottom gradient bar */}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Camera className="w-4 h-4" />
                                {activeReport.deviceName}
                                <span className="text-xs opacity-60 ml-1">
                                    ({formatDistanceToNow(new Date(activeReport.detectedAt), { addSuffix: true })})
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs opacity-80">
                                <MapPin className="w-3 h-3" />
                                {activeReport.location.lat.toFixed(4)}, {activeReport.location.lng.toFixed(4)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gemini AI Analysis Panel */}
                {activeReport.aiDescription && (
                    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                        <CardContent className="p-4 flex gap-3">
                            <Bot className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Gemini AI Analysis</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{activeReport.aiDescription}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Sidebar: feed thumbnail list */}
            <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-3">
                    All Feeds ({reports.length})
                </p>
                {reports.map((report, i) => {
                    const hasIssue = report.issueType !== 'No Issues';
                    return (
                        <button
                            key={report.id}
                            onClick={() => setSelected(i)}
                            className={`w-full text-left rounded-lg overflow-hidden border-2 transition-all ${selected === i ? 'border-primary ring-2 ring-primary/30' : 'border-muted hover:border-muted-foreground/40'}`}
                        >
                            <div className="relative aspect-video bg-muted">
                                {report.imageUrl ? (
                                    <img src={report.imageUrl} alt={report.issueType} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Camera className="w-5 h-5 text-muted-foreground/40" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-white font-medium truncate">{report.deviceName}</span>
                                        {hasIssue
                                            ? <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                                            : <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                                        }
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
