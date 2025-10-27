'use client';
import { CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ProgressSummaryProps {
  icon: LucideIcon;
  title: ReactNode;
  value: string;
  description: ReactNode;
  progress?: number;
}

export function ProgressSummaryContent({
  icon: Icon,
  title,
  value,
  description,
  progress,
}: ProgressSummaryProps) {
    return (
        <div>
            <div className="flex items-baseline justify-between pb-2">
                <div className="flex items-baseline gap-2">
                    <CardTitle className="text-xl font-semibold leading-none tracking-tight">
                        {title}
                    </CardTitle>
                    <div className="text-2xl font-bold">
                        {value}
                    </div>
                </div>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
                {progress !== undefined && (
                    <Progress value={progress} className="mt-4 h-2 w-full" />
                )}
            </div>
        </div>
    );
}


export default function ProgressSummary(props: ProgressSummaryProps) {
  return (
    <div className="p-6">
        <ProgressSummaryContent {...props} />
    </div>
  );
}
