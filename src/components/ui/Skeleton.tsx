import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-stone-900/70 light:bg-stone-200/80 ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  );
}

export function LessonCardSkeleton() {
  return (
    <div className="rounded-2xl border border-stone-800 light:border-stone-300 bg-stone-900/40 light:bg-stone-100/80 p-5 space-y-3" aria-hidden="true">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

export default Skeleton;
