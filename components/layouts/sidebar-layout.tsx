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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Fragment, ReactNode } from "react";

export interface SidebarGroupProps {
  title: string;
  items: SidebarMenuItemProps[];
}

export interface SidebarMenuItemProps {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface BreadcrumbItemProps {
  title: string;
  url: string;
}

interface SidebarLayoutProps {
  content: SidebarGroupProps[];
  breadcrumbs: BreadcrumbItemProps[];
  children: ReactNode;
}

export const SidebarLayout = ({ content, breadcrumbs, children }: SidebarLayoutProps) => (
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <Input />
      </SidebarHeader>
      <SidebarContent>
        {content.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
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
      <main className="flex flex-1 flex-col p-4">{children}</main>
    </SidebarInset>
  </SidebarProvider>
);
