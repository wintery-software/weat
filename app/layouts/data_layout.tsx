import MainLayout from '@/app/layouts/main_layout';
import { ReactNode } from 'react';

export default function DataLayout({
  filter,
  content,
}: {
  filter: ReactNode;
  content: ReactNode;
}) {
  return (
    <MainLayout>
      <div className="flex">
        <div className="min-w-64 max-w-64 pr-8 hidden md:block">{filter}</div>
        {content}
      </div>
    </MainLayout>
  );
}
