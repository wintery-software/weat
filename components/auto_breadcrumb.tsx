import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Fragment, ReactNode } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

export interface AutoBreadcrumbProps {
  className?: string;
  parents?: { name: string; url: string }[];
  current: ReactNode;
  prependHome?: boolean;
}

export default function AutoBreadcrumb({
  className,
  parents = [],
  current,
  prependHome = true,
}: AutoBreadcrumbProps) {
  if (prependHome && parents[0]?.url !== '/') {
    parents.unshift({ name: '首页', url: '/' });
  }

  const fontSize = 'text-sm';

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="flex-nowrap">
        {parents.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem className="flex-shrink-0">
              <BreadcrumbLink className={fontSize} href={item.url}>
                {item.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem className="overflow-hidden">
          <BreadcrumbPage className={cn(fontSize, 'truncate')}>
            {current ? (
              current
            ) : (
              <div className="flex">
                <Skeleton className="h-5 w-24" />
              </div>
            )}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
