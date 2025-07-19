"use client";

import { WeatLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { createCSRClient } from "@/lib/supabase/clients/csr";
import { cn } from "@/lib/utils";
import { type Profile } from "@/types/types";
import { type User } from "@supabase/supabase-js";
import {
  HelpCircleIcon,
  LogOutIcon,
  Menu,
  SettingsIcon,
  ShieldIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
} from "react";

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

const UserControl = ({
  user,
  profile,
  supabase,
  setUser,
  setProfile,
}: {
  user: User | null;
  profile: Profile | null;
  supabase: ReturnType<typeof createCSRClient>;
  setUser: Dispatch<SetStateAction<User | null>>;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
}) => {
  if (!user || !profile) {
    return (
      <Button size="sm" variant="secondary" asChild>
        <Link href="/login">登录</Link>
      </Button>
    );
  }

  const isAdmin = profile?.roles?.includes("admin");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <UserAvatar profile={profile} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/settings">
            <SettingsIcon />
            Settings
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/admin" className="flex items-center gap-2 font-medium">
              <ShieldIcon className="text-sky-500" />
              <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-rose-500 bg-clip-text text-transparent transition-all duration-200 focus:from-sky-600 focus:via-purple-600 focus:to-rose-600">
                Admin Dashboard
              </span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/help">
            <HelpCircleIcon />
            Help
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
          }}
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Navbar = ({ groups, glass = true }: NavbarProps) => {
  const supabase = createCSRClient();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);

      if (userData.user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userData.user.id)
          .single();

        if (!error) {
          setProfile(profileData);
        }
      }
    };

    fetchUserAndProfile();
  }, [supabase]);

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

      <Link href="/" className="flex items-center select-none">
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
              size="sm"
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
        <UserControl
          user={user}
          profile={profile}
          supabase={supabase}
          setUser={setUser}
          setProfile={setProfile}
        />
      </div>

      <div className="md:hidden">
        <UserControl
          user={user}
          profile={profile}
          supabase={supabase}
          setUser={setUser}
          setProfile={setProfile}
        />
      </div>
    </header>
  );
};
