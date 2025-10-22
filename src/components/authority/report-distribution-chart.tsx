'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Report } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  eachDayOfInterval,
  format,
  startOfWeek,
  subWeeks,
  isSameDay,
} from 'date-fns';
import { CalendarDays } from 'lucide-react';

const WEEK_COUNT = 16;

function getColor(count: number): string {
  if (count === 0) return 'bg-muted/50 dark:bg-muted/30';
  if (count < 2) return 'bg-blue-300 dark:bg-blue-800';
  if (count < 4) return 'bg-blue-400 dark:bg-blue-600';
  if (count < 6) return 'bg-blue-500 dark:bg-blue-500';
  return 'bg-blue-600 dark:bg-blue-400';
}

export function ReportDistributionChart({ reports }: { reports: Report[] }) {
  const today = new Date();
  const startDate = startOfWeek(subWeeks(today, WEEK_COUNT - 1));
  const days = eachDayOfInterval({ start: startDate, end: today });

  const data = days.map((day) => ({
    date: day,
    count: reports.filter((report) =>
      isSameDay(new Date(report.createdAt), day)
    ).length,
  }));
  
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }
  
  const monthLabels = weeks.map((week, weekIndex) => {
    const firstDay = week[0]?.date;
    if (firstDay && firstDay.getDate() <= 7) {
      return {
        label: format(firstDay, 'MMM'),
        weekIndex,
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <CalendarDays className="text-primary" />
          <span>Report Distribution</span>
        </CardTitle>
        <CardDescription>
          Daily report submission activity over the last {WEEK_COUNT} weeks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex flex-col items-start overflow-auto">
            {/* The main heatmap grid, with month labels positioned below */}
            <div className="flex gap-1.5 mt-6">
                {weeks.map((week, weekIndex) => (
                    <div key={`week-${weekIndex}`} className="flex flex-col justify-between items-center">
                        <div className="grid grid-rows-7 gap-y-1.5">
                            {week.map((dayData) => (
                                <Tooltip key={dayData.date.toISOString()} delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                'h-3 w-3 rounded-sm',
                                                getColor(dayData.count)
                                            )}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-sm">
                                            {dayData.count} report{dayData.count !== 1 ? 's' : ''} on{' '}
                                            {format(dayData.date, 'MMM d, yyyy')}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                        {/* Month label positioning */}
                        {monthLabels.find(m => m.weekIndex === weekIndex) && (
                            <div className="mt-2 text-xs text-muted-foreground">
                                {monthLabels.find(m => m.weekIndex === weekIndex).label}
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
