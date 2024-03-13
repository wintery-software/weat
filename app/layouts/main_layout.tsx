import Navbar from '@/components/navbar';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar sticky />
      <div className="container h-full py-6">
        <main>{children}</main>
      </div>
    </>
  );
}
