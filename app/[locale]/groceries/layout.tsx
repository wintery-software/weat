import NavbarLayout from '@/app/[locale]/layouts/navbar_layout';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return <NavbarLayout>{children}</NavbarLayout>;
};

export default Layout;
