import NavbarLayout from '@/app/layouts/navbar_layout';
import AutoBreadcrumb, {
  AutoBreadcrumbProps,
} from '@/components/auto_breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export const StandardLayout = ({ children }: { children: ReactNode }) => (
  <NavbarLayout>{children}</NavbarLayout>
);

export const StandardLayoutHeader = ({ children }: { children: ReactNode }) => (
  <div className="shadow-md py-6 bg-white">
    <div className="container">{children}</div>
  </div>
);

export const StandardLayoutBradcrumb = ({ ...props }: AutoBreadcrumbProps) => (
  <AutoBreadcrumb className="mb-4" {...props} />
);

export const StandardLayoutTitle = ({
  children,
  isLoading = false,
}: {
  children: ReactNode;
  isLoading?: boolean;
}) =>
  isLoading ? (
    <div className="flex items-center h-[30px]">
      <Skeleton className="h-6 w-1/2" />
    </div>
  ) : (
    <p className="text-2xl font-bold mb-2">{children}</p>
  );

export const StandardLayoutDescription = ({
  children,
  isLoading = false,
}: {
  children: ReactNode;
  isLoading?: boolean;
}) =>
  isLoading ? (
    <div className="flex items-center h-6">
      <Skeleton className="h-3 w-3/4" />
    </div>
  ) : (
    <p className="text-sm text-gray-500">{children}</p>
  );

export const StandardLayoutContent = ({
  children,
  isLoading = false,
  skeletonCount = 10,
  skeletonWrapperClassName = 'py-4 border-b',
  skeletonClassName = 'h-6',
}: {
  children: ReactNode;
  isLoading?: boolean;
  skeletonCount?: number;
  skeletonWrapperClassName?: string;
  skeletonClassName?: string;
}) => (
  <div className="container py-4">
    {isLoading ? (
      <div>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className={skeletonWrapperClassName}>
            <Skeleton className={cn('w-full', skeletonClassName)} />
          </div>
        ))}
      </div>
    ) : (
      children
    )}
  </div>
);

export const StandardLayoutContentSection = ({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) => (
  <div className="py-8">
    {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
    {children}
  </div>
);

export const StandardLayoutNoResult = () => (
  <div className="flex items-center justify-center h-[50dvh]">
    <span className="text-muted-foreground">没有结果</span>
  </div>
);
