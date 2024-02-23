import { Navbar } from '@/components/navbar';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="container h-full py-6">
        <main className="flex flex-row">{children}</main>
      </div>
    </>
  );
}
