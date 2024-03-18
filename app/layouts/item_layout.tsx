import NavbarLayout from '@/app/layouts/navbar_layout';
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
    <NavbarLayout>
      <AutoBreadcrumb
        parents={breadcrumbParents}
        current={breadcrumbCurrent}
        className="container py-4"
      />
      {children}
    </NavbarLayout>
  );
}
