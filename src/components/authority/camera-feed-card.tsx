
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IoTReport } from '@/lib/types';
import { MapPin, Camera, ImageOff, Bot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface CameraFeedCardProps {
    report: IoTReport;
    onAssign?: (id: string) => void;
}

const severityColors: Record<string, string> = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-600',
};

export function CameraFeedCard({ report, onAssign }: CameraFeedCardProps) {
    const isIssue = report.issueType !== 'No Issues';
    const [imgError, setImgError] = useState(false);

    return (
        <Card className={`overflow-hidden border-l-4 transition-shadow hover:shadow-lg ${isIssue ? 'border-l-red-500' : 'border-l-green-500'}`}>
            <div className="relative aspect-video bg-muted group">
                {/* LIVE indicator */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded text-xs font-mono">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    LIVE
                </div>

                {/* Severity chip */}
                {isIssue && (
                    <div className={`absolute top-2 right-2 z-10 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${severityColors[report.severity] ?? 'bg-gray-500'}`}>
                        {report.severity}
                    </div>
                )}

                {/* Image */}
                {!imgError && report.imageUrl ? (
                    <img
                        src={report.imageUrl}
                        alt={report.issueType}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/50">
                        <ImageOff className="w-8 h-8 opacity-40" />
                        <span className="text-xs">No image available</span>
                    </div>
                )}

                {/* Bottom overlay: device + time */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            {report.deviceName}
                        </div>
                        <div className="text-xs opacity-80">
                            {formatDistanceToNow(new Date(report.detectedAt), { addSuffix: true })}
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="p-4 pt-3 space-y-3">
                {/* Location + issue badge */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[180px]" title={`Lat: ${report.location.lat}, Lng: ${report.location.lng}`}>
                            {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                        </span>
                    </div>
                    <Badge variant={isIssue ? (report.severity === 'High' ? 'destructive' : 'default') : 'outline'}>
                        {report.issueType}
                    </Badge>
                </div>

                {/* Gemini AI Description */}
                {report.aiDescription && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-2.5 rounded-md text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-400">
                            <Bot className="w-3.5 h-3.5" />
                            Gemini Analysis
                        </div>
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">{report.aiDescription}</p>
                    </div>
                )}

                {/* Confidence bar (shown only when no AI description, as fallback UI) */}
                {isIssue && !report.aiDescription && (
                    <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded text-xs space-y-1">
                        <div className="flex justify-between font-medium text-red-700 dark:text-red-400">
                            <span>AI Confidence</span>
                            <span>{(report.confidenceScore * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-red-200 dark:bg-red-900 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 dark:bg-red-500 rounded-full" style={{ width: `${report.confidenceScore * 100}%` }} />
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-3 bg-muted/50 flex gap-2">
                <Button size="sm" variant="outline" className="w-full" disabled={!isIssue}>
                    {isIssue ? 'View Details' : 'System Normal'}
                </Button>
            </CardFooter>
        </Card>
    );
}
