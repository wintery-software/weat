"use client";

import { WeatLogo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement, isValidElement, ReactNode, useState } from "react";

interface RouteGroup {
  label: string;
  routes: RouteItem[];
}
interface RouteItem {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
}

interface NavbarProps {
  groups: RouteGroup[];
  glass?: boolean;
}

export const Navbar = ({ groups, glass = true }: NavbarProps) => {
  const pathname = usePathname();

  // Update active state based on current pathname
  const routesWithActiveState = groups.map((group) => ({
    ...group,
    routes: group.routes.map((route) => ({
      ...route,
      active:
        route.active ?? pathname.split("/")[1] === route.href.split("/")[1],
    })),
  }));

  const [isOpen, setIsOpen] = useState(false);

  const renderIcon = (icon: ReactNode, ...classNames: string[]): ReactNode => {
    if (isValidElement<{ className?: string }>(icon)) {
      return cloneElement(icon, {
        className: [icon.props.className, ...classNames]
          .filter(Boolean)
          .join(" "),
      });
    }

    return icon;
  };

  return (
    <header
      id="navbar"
      className="bg-background sticky top-0 z-50 container flex h-(--header-height) w-full items-center justify-between py-0"
    >
      <div className="flex items-center gap-2 md:hidden">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
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
            className={cn(
              "h-dvh w-dvw rounded-none border-none px-0 py-4",
              glass && "glass",
            )}
            onClick={(e) => {
              // Close if clicking on empty space
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          >
            <div className="container flex flex-col gap-8 px-4">
              {routesWithActiveState.map((group) => (
                <div key={group.label} className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-sm font-medium">
                    {group.label}
                  </span>
                  {group.routes.map((route, i) => (
                    <DropdownMenuItem
                      key={i}
                      className="flex cursor-pointer items-center gap-2 px-0 py-2 focus:bg-transparent"
                      asChild
                    >
                      <Link href={route.href}>
                        {renderIcon(route.icon, "size-6")}
                        <span className="text-2xl font-medium">
                          {route.label}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link href="/" className="flex items-center">
        <WeatLogo className="size-8" />
        <span className="font-[winkyRough] text-xl font-semibold tracking-tight">
          weat
        </span>
      </Link>

      <div className="glass hidden items-center md:flex md:gap-2">
        {routesWithActiveState.map((group) =>
          group.routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "default" : "ghost"}
              asChild
            >
              <Link href={route.href} className="flex items-center gap-2">
                {renderIcon(route.icon, "size-4")}
                {route.label}
              </Link>
            </Button>
          )),
        )}
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      <div className="md:hidden">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
