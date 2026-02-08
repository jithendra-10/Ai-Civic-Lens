import { CommunityFeed } from '@/components/citizen/community-feed';
import { Sparkles } from 'lucide-react';

export default function FeedPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-primary animate-ai-pulse" />
                        Community Pulse
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        See what's happening in your city in real-time.
                    </p>
                </div>
            </div>

            <CommunityFeed />
        </div>
    );
}
