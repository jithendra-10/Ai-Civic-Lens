"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Report } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { MapPin, ThumbsUp, MessageCircle, Share2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";

interface FeedCardProps {
    report: Report;
    onUpvote?: (id: string) => void;
}

export function FeedCard({ report, onUpvote }: FeedCardProps) {
    const statusColor = {
        Submitted: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
        "In Progress": "bg-blue-500/10 text-blue-600 border-blue-200",
        Resolved: "bg-green-500/10 text-green-600 border-green-200",
        Rejected: "bg-red-500/10 text-red-600 border-red-200",
    };

    const severityColor = {
        Low: "bg-slate-100 text-slate-600",
        Medium: "bg-orange-50 text-orange-600",
        High: "bg-red-50 text-red-600",
    };

    return (
        <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Header: User & Meta */}
            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2 space-y-0">
                <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.userFullName}`} />
                    <AvatarFallback>{report.userFullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{report.userFullName}</span>
                        {report.role === 'authority' && <Badge variant="secondary" className="text-[10px] h-4 px-1">Official</Badge>}
                        <span className="text-xs text-muted-foreground">• {formatDistanceToNow(new Date(report.createdAt))} ago</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{report.location ? `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}` : 'Unknown Location'}</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <Badge variant="outline" className={`${statusColor[report.status]} capitalize`}>
                        {report.status}
                    </Badge>
                </div>
            </CardHeader>

            {/* Media Content */}
            <div className="relative aspect-video w-full bg-slate-100 mt-2">
                {report.imageUrl ? (
                    <Image
                        src={report.imageUrl}
                        alt={report.issueType}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <AlertTriangle className="h-8 w-8 opacity-20" />
                    </div>
                )}
                <div className="absolute bottom-3 left-3">
                    <Badge className={`${severityColor[report.severity]} backdrop-blur-md border-white/20 shadow-sm`}>
                        {report.severity} Severity
                    </Badge>
                </div>
            </div>

            {/* Body Content */}
            <CardContent className="p-4 pt-4">
                <h3 className="font-bold font-headline text-lg mb-1">{report.issueType}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {report.aiDescription}
                </p>
            </CardContent>

            {/* Footer: Actions */}
            <CardFooter className="p-4 pt-0 flex justify-between border-t bg-slate-50/50 mt-2">
                <div className="flex items-center gap-4 py-3">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-primary" onClick={() => onUpvote?.(report.id!)}>
                        <ThumbsUp className="h-4 w-4" />
                        <span>{report.upvoteCount || 0} Supports</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-blue-500">
                        <MessageCircle className="h-4 w-4" />
                        <span>Comment</span>
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Share2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
