
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IoTReport } from '@/lib/types';
import { MapPin, AlertTriangle, CheckCircle, Activity, Camera } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CameraFeedCardProps {
    report: IoTReport;
    onAssign?: (id: string) => void;
}

export function CameraFeedCard({ report, onAssign }: CameraFeedCardProps) {
    const isIssue = report.issueType !== 'No Issues';

    return (
        <Card className={`overflow-hidden border-l-4 ${isIssue ? 'border-l-red-500' : 'border-l-green-500'}`}>
            <div className="relative aspect-video bg-muted group">
                {/* Simulated Live Feed Indicator */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded text-xs font-mono">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    LIVE
                </div>

                <img
                    src={report.imageUrl}
                    alt={report.issueType}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                />

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
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[180px]" title={`Lat: ${report.location.lat}, Lng: ${report.location.lng}`}>
                                {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                            </span>
                        </div>
                    </div>
                    <Badge variant={isIssue ? (report.severity === 'High' ? 'destructive' : 'default') : 'outline'}>
                        {report.issueType}
                    </Badge>
                </div>

                {isIssue && (
                    <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded text-xs space-y-1">
                        <div className="flex justify-between font-medium text-red-700 dark:text-red-400">
                            <span>AI Confidence</span>
                            <span>{(report.confidenceScore * 100).toFixed(1)}%</span>
                        </div>
                        {/* Confidence Bar */}
                        <div className="h-1.5 w-full bg-red-200 dark:bg-red-900 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-600 dark:bg-red-500 rounded-full"
                                style={{ width: `${report.confidenceScore * 100}%` }}
                            />
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
