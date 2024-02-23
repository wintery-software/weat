import Rating from '@/components/rating';
import {
  Sidebar,
  SidebarSeparator,
  SidebarSubTitle,
  SidebarTitle,
  SidebarToggleGroup,
} from '@/components/sidebar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const getCategories = async () => {
  const response = await fetch('http://localhost:3000/api/categories');
  return response.json();
};

export default async function Filter({ ...props }) {
  const categories = await getCategories();

  return (
    <Sidebar {...props}>
      <SidebarTitle>Filters</SidebarTitle>
      <SidebarSeparator />

      <SidebarSubTitle>Category</SidebarSubTitle>
      <SidebarToggleGroup items={categories} />
      <SidebarSeparator />

      <SidebarSubTitle>Price</SidebarSubTitle>
      <ToggleGroup
        className="flex-wrap justify-start"
        size="sm"
        type="multiple"
        variant="outline"
      >
        {Array.from({ length: 3 }, (_, i) => i + 1).map((value, index) => (
          <ToggleGroupItem
            className="text-xs"
            key={index}
            value={value.toString()}
          >
            {'$'.repeat(value)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <SidebarSeparator />

      <SidebarSubTitle>Rating</SidebarSubTitle>
      <Rating />
      <SidebarSeparator />

      <SidebarSubTitle>Distance</SidebarSubTitle>
    </Sidebar>
  );
}
