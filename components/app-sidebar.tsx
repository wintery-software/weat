import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { APP_NAME } from "@/lib/constants";
import { GhostIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface AppSidebarMenuItem {
  label: string;
  icon: ReactNode;
  href: string;
  active?: boolean;
}

export interface AppSidebarGroup {
  label?: string;
  items: AppSidebarMenuItem[];
}

export interface AppSidebarProps {
  homePage: string;
  groups?: AppSidebarGroup[];
  footer?: ReactNode;
}

export const AppSidebar = ({ homePage, groups, footer }: AppSidebarProps) => (
  <Sidebar variant={"inset"}>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link href={homePage}>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GhostIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{APP_NAME}</span>
                <span className="truncate text-xs">Admin Dashboard</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      {groups?.map((group, groupIndex) => (
        <SidebarGroup key={groupIndex}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item, itemIndex) => (
                <SidebarMenuItem key={itemIndex}>
                  <SidebarMenuButton isActive={item.active} asChild>
                    <Link href={item.href}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
    <SidebarFooter>{footer}</SidebarFooter>
    <SidebarRail />
  </Sidebar>
);
