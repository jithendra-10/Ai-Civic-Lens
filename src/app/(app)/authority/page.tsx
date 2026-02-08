
import { AnalyticsDashboard } from '@/components/authority/analytics-dashboard';
import { SurveillanceDashboard } from '@/components/authority/surveillance-dashboard';
import { BrainCircuit, Activity, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function AuthorityDashboardPage() {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary/80 animate-ai-pulse" />
            <div>
              <h1 className="text-3xl font-bold font-headline">Authority Dashboard</h1>
              <p className="text-muted-foreground">
                Analyze, manage, and resolve civic issues reported by citizens.
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="analytics" className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="surveillance" className="gap-2">
                <Activity className="w-4 h-4" />
                Surveillance & Monitoring
                <span className="ml-1 rounded-full bg-red-100 text-red-600 px-1.5 py-0.5 text-[10px] font-bold">LIVE</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="surveillance" className="space-y-4">
            <SurveillanceDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

