import { SearchBar } from '@/components/search_bar';
import { cn } from '@/lib/utils';

export const Navbar = ({ className, ...props }: { className?: string }) => {
  return (
    <div {...props}>
      <SearchBar />
    </div>
  );
};
