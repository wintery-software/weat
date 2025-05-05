import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Fragment } from "react";

export interface SidebarGroupProps {
  title?: string;
  items: SidebarMenuItemProps[];
}

export interface SidebarMenuItemProps {
  title?: string;
  icon?: LucideIcon;
  url: string;
  isActive?: boolean;
}

export interface BreadcrumbItemProps {
  title: string;
  url: string;
}

interface SidebarLayoutProps {
  content: SidebarGroupProps[];
  footer?: SidebarGroupProps[];
  breadcrumbs: BreadcrumbItemProps[];
  children: ReactNode;
}

export const SidebarLayout = ({ content, footer, breadcrumbs, children }: SidebarLayoutProps) => (
  <SidebarProvider>
    <div className="flex w-full flex-1 overflow-hidden">
      <Sidebar className="pt-12" collapsible={"icon"}>
        <SidebarHeader>
          <Input />
        </SidebarHeader>
        <SidebarContent>
          {content.map((item, index1) => (
            <SidebarGroup key={index1}>
              {item.title && <SidebarGroupLabel>{item.title}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item, index2) => (
                    <SidebarMenuItem key={index2}>
                      <SidebarMenuButton tooltip={item.title} isActive={item.isActive} asChild>
                        <a href={item.url}>
                          {item.icon && <item.icon />}
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="px-0">
          {footer?.map((item, index1) => (
            <SidebarGroup key={index1}>
              {item.title && <SidebarGroupLabel>{item.title}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item, index2) => (
                    <SidebarMenuItem key={index2}>
                      <SidebarMenuButton tooltip={item.title} isActive={item.isActive} asChild>
                        <a href={item.url}>
                          {item.icon && <item.icon />}
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarFooter>
        {/*<SidebarRail />*/}
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.slice(0, -1).map((item) => (
                  <Fragment key={item.url}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </Fragment>
                ))}
                {breadcrumbs.slice(-1).map((item) => (
                  <BreadcrumbItem key={item.title}>
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  </SidebarProvider>
);
