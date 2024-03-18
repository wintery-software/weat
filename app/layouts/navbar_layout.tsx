import Navbar from '@/components/navbar';
import { ReactNode } from 'react';

export default function NavbarLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar sticky />
      <main>{children}</main>
    </>
  );
}
