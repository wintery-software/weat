import { Navbar } from "@/components/navbar";
import { Home, Search } from "lucide-react";
import { ReactNode } from "react";

interface NavbarLayoutProps {
  children: ReactNode;
}

export const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  const routes = [
    {
      href: "/",
      label: "主页",
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/restaurants",
      label: "餐厅",
      icon: <Search className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container py-3">
          <Navbar routes={routes} />
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6 md:py-8">{children}</div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-muted-foreground text-center text-sm md:text-left">
            &copy; {new Date().getFullYear()} Wintery Software. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
