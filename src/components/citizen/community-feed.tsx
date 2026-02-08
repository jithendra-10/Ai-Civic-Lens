"use client";

import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { FeedCard } from './feed-card';
import { Report } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function CommunityFeed() {
    const firestore = useFirestore();

    const feedQuery = useMemoFirebase(
        () =>
            firestore
                ? query(
                    collection(firestore, 'reports'),
                    orderBy('createdAt', 'desc'),
                    limit(50)
                )
                : null,
        [firestore]
    );

    const { data: reports, isLoading, error } = useCollection<Report>(feedQuery);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load the community feed. Please try again later.
                </AlertDescription>
            </Alert>
        )
    }

    if (!reports || reports.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p>No reports found in your community yet.</p>
                <p>Be the first to report an issue!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-0 duration-500">
            {reports.map((report) => (
                <FeedCard key={report.id} report={report} />
            ))}
        </div>
    );
}
