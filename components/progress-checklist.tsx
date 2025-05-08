'use client';



import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'incomplete' | 'ready';
  href: string;
  icon: React.ReactNode;
}

interface ProgressChecklistProps {
  items: ChecklistItem[];
}

export function ProgressChecklist({ items }: ProgressChecklistProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-2 rounded-full",
              item.status === 'completed' ? "bg-green-500/10 text-green-500" :
              item.status === 'ready' ? "bg-blue-500/10 text-blue-500" :
              "bg-muted text-muted-foreground"
            )}>
              {item.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : item.icon}
            </div>
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-1 text-xs rounded-full",
              item.status === 'completed' ? "bg-green-500/10 text-green-500" :
              item.status === 'ready' ? "bg-blue-500/10 text-blue-500" :
              "bg-muted text-muted-foreground"
            )}>
              {item.status === 'completed' ? 'Completed' :
               item.status === 'ready' ? 'Ready' : 'Incomplete'}
            </span>
            <Button variant="ghost" size="sm" asChild>
              <Link href={item.href}>
                {item.status === 'completed' ? 'Edit' : 'Go'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 