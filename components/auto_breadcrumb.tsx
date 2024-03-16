import { cn } from '@/lib/utils';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

interface AutoBreadcrumbProps {
  className?: string;
  parents: { name: string; url: string }[];
  current: string;
  prependHome?: boolean;
}

export default function AutoBreadcrumb({
  className,
  parents,
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
            {current}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
