import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { API } from "@/types/api";

interface SearchResultProps {
  items: API.Place[] | undefined;
  onSelectedChange: (item: API.Place) => void;
}

const SearchResult = ({ items, onSelectedChange }: SearchResultProps) => {
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
              <p className="font-semibold">{p.name}</p>
              {p.name_zh && <p className="text-xs">{p.name_zh}</p>}
              <p className="text-xs text-muted-foreground">{p.address}</p>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SearchResult;
