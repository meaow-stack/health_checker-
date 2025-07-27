import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  children?: ReactNode; // For actions or extra content
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-lg text-muted-foreground font-body">
              {description}
            </p>
          )}
        </div>
        {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
