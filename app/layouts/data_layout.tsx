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
      <div className="w-52">{filter}</div>
      {content}
    </MainLayout>
  );
}
