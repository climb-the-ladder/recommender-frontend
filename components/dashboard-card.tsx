import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'in-progress' | 'not-started';
  href: string;
}

export function DashboardCard({ title, description, icon, status, href }: DashboardCardProps) {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'not-started': 'bg-gray-100 text-gray-800',
  };

  const statusText = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    'not-started': 'Not Started',
  };

  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              statusColors[status]
            )}
          >
            {statusText[status]}
          </span>
        </div>
      </div>
    </Link>
  );
} 