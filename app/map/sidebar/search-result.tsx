import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton } from "@/components/ui/sidebar";

interface SearchResultProps {
  items: Weat.Place[] | undefined;
  isLoading?: boolean;
  onSelectedChange: (item: Weat.Place) => void;
}

const SearchResult = ({ items, isLoading, onSelectedChange }: SearchResultProps) => {
  if (isLoading) {
    return (
      <SidebarMenu>
        {Array.from({ length: 10 }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  if (!Array.isArray(items)) {
    return null;
  }

  if (items.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="h-auto" asChild>
            <p className="text-muted-foreground">No results found.</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {items.map((p, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton className="h-auto" onClick={() => onSelectedChange(p)}>
            <div className="flex flex-col">
              <p className="font-semibold">{p.names[0].text}</p>
              {p.names?.[1] && <p className="text-xs">{p.names[1].text}</p>}
              <p className="text-xs text-muted-foreground">{p.address}</p>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SearchResult;
