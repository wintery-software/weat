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

  const fontSize = `text-xs md:text-sm`;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {parents.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink className={fontSize} href={item.url}>
                {item.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage className={fontSize}>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
