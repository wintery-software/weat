"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_NAME } from "@/lib/constants";
import { Menu, X } from "lucide-react";
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

  // Update active state based on current pathname
  const routesWithActiveState = routes.map((route) => ({
    ...route,
    active: route.active ?? pathname.split("/")[1] === route.href.split("/")[1],
  }));

  const [isOpen, setIsOpen] = useState(false);

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
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent focus-visible:ring-0"
            >
              <div
                className={`ease-bounce transition-all duration-200 ${isOpen ? "scale-110 rotate-180" : "scale-100 rotate-0"}`}
              >
                {isOpen ? <X /> : <Menu />}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="glass h-dvh w-dvw rounded-none border-none"
            sideOffset={12}
          >
            {routesWithActiveState.map((route) => (
              <DropdownMenuItem key={route.href} asChild>
                <Link href={route.href} className="flex items-center gap-2">
                  {route.icon}
                  {route.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
