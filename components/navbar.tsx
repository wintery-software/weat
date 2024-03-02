import { SearchDialog } from '@/components/search_dialog';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

export const Navbar = ({ className, ...props }: { className?: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div {...props}>
      <Button
        variant="outline"
        className="justify-start w-full font-normal"
        onClick={() => {
          setOpen(true);
        }}
      >
        <SearchIcon className="mr-2" size={14} />
        搜索...
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </div>
  );
};
