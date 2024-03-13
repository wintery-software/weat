import MainLayout from '@/app/layouts/main_layout';
import AutoBreadcrumb from '@/components/auto_breadcrumb';
import { ReactNode } from 'react';

interface AutoBreadcrumbProps {
  breadcrumbParents: { name: string; url: string }[];
  breadcrumbCurrent: string;
  children: ReactNode;
}

export default function ItemLayout({
  breadcrumbParents,
  breadcrumbCurrent,
  children,
}: AutoBreadcrumbProps) {
  return (
    <MainLayout>
      <div className="flex flex-col">
        <AutoBreadcrumb
          parents={breadcrumbParents}
          current={breadcrumbCurrent}
          className="mb-6"
        />
        {children}
      </div>
    </MainLayout>
  );
}
