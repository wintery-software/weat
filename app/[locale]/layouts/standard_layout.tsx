import AutoBreadcrumb, {
  AutoBreadcrumbProps,
} from '@/components/auto_breadcrumb';
import BackButton from '@/components/back_button';
import { IconChevronLeft } from '@tabler/icons-react';
import { ReactNode } from 'react';

export const StandardLayout = ({ children }: { children: ReactNode }) => (
  <div className="container flex flex-col gap-4 p-4">{children}</div>
);

export const StandardLayoutBradcrumb = ({ ...props }: AutoBreadcrumbProps) => (
  <AutoBreadcrumb className="hidden md:flex items-center h-9" {...props} />
);

export const StandardLayoutHeader = ({
  title,
  status,
}: {
  title: string;
  status?: ReactNode;
}) => {
  return (
    <div className="flex items-center gap-4">
      <BackButton variant="outline" size="icon" className="h-7 w-7">
        <IconChevronLeft className="h-4 w-4" />
      </BackButton>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-lg md:text-xl font-semibold tracking-tight md:grow-0">
        {title}
      </h1>
      {status && (
        <div className="ml-auto md:ml-0 flex items-center">{status}</div>
      )}
    </div>
  );
};

export const StandardLayoutContent = ({
  children,
}: {
  children: ReactNode;
}) => <main>{children}</main>;
