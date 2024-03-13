'use client';

import SearchDialog from '@/components/search_dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({
  className,
  sticky,
  ...props
}: {
  className?: string;
  sticky?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      {...props}
      className={cn(className, sticky ? 'sticky top-0 z-40' : '')}
    >
      <Button
        variant="outline"
        className="justify-start w-full font-normal border-none"
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
}
