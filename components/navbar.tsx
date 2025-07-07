"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

interface Route {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
}

interface NavbarProps {
  routes: Route[];
}

export const Navbar = ({ routes }: NavbarProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Update active state based on current pathname
  const routesWithActiveState = routes.map((route) => ({
    ...route,
    active: route.active ?? pathname.split("/")[1] === route.href.split("/")[1],
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-primary text-xl font-bold">{APP_NAME}</span>
        </Link>
      </div>

      <div className="hidden items-center space-x-4 md:flex">
        {routesWithActiveState.map((route) => (
          <Button
            key={route.href}
            variant={route.active ? "default" : "ghost"}
            asChild
          >
            <Link href={route.href} className="flex items-center gap-2">
              {route.icon}
              {route.label}
            </Link>
          </Button>
        ))}
      </div>

      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <div className="flex flex-col gap-4 py-4">
              {routesWithActiveState.map((route) => (
                <Button
                  key={route.href}
                  variant={route.active ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setIsOpen(false)}
                  asChild
                >
                  <Link href={route.href} className="flex items-center gap-2">
                    {route.icon}
                    {route.label}
                  </Link>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
