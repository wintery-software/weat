import { Link } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
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
  base?: keyof IntlMessages['components']['breadcrumb'];
  items: { name: string; url?: string }[];
}

const AutoBreadcrumb = ({
  className,
  base = 'home',
  items = [],
}: AutoBreadcrumbProps) => {
  const t = useTranslations();
  items.unshift({ name: t(`components.breadcrumb.${base}`), url: `/${base}` });
  const current = items.pop()!;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          if (!item.url) {
            throw new Error(`Breadcrumb item "${item.name}" is missing URL`);
          }

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={item.url}>{item.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
        <BreadcrumbItem>
          <BreadcrumbPage>{current.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AutoBreadcrumb;
