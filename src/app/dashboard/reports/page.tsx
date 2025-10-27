'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ProgressChart = dynamic(() => import('@/components/reports/progress-chart'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export default function ReportsPage() {
  const { t } = useTranslation();
  const [range, setRange] = React.useState('weekly');
   const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between gap-1 bg-background px-4">
          <div className="flex items-center gap-1 w-full">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold truncate"><ClientOnlyT tKey='reports.title' /></h1>
          </div>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle><ClientOnlyT tKey='reports.performanceTitle' /></CardTitle>
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                        'w-[300px] justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, 'LLL dd, y')} -{' '}
                            {format(date.to, 'LLL dd, y')}
                            </>
                        ) : (
                            format(date.from, 'LLL dd, y')
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                <Select value={range} onValueChange={setRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={<ClientOnlyT tKey='reports.selectRange' />} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="weekly"><ClientOnlyT tKey='reports.thisWeek' /></SelectItem>
                        <SelectItem value="monthly"><ClientOnlyT tKey='reports.thisMonth' /></SelectItem>
                        <SelectItem value="yearly"><ClientOnlyT tKey='reports.thisYear' /></SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ProgressChart />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
