'use client';

import SearchDialog from '@/components/search_dialog';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { IconShoppingCart } from '@tabler/icons-react';
import { SearchIcon } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const d = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  price: i + 0.99,
  image: 'https://via.placeholder.com/36',
}));

export default function Navbar({
  className,
  sticky,
  ...props
}: {
  className?: string;
  sticky?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<any[]>(d);

  return (
    <div
      {...props}
      className={cn(className, sticky ? 'flex sticky top-0 z-40 bg-white' : '')}
    >
      <Button
        variant="outline"
        className="flex-1 justify-start font-normal border-none"
        onClick={() => {
          setOpen(true);
        }}
      >
        <SearchIcon className="mr-2" size={14} />
        搜索...
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" asChild>
            <p className="flex gap-1 items-center">
              <IconShoppingCart size={16} />
              {cartItems.length}
            </p>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col gap-4">
            <ScrollArea className="w-full h-60">
              <div className="flex flex-col gap-1">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-2 h-9">
                    <Image
                      src={item.image}
                      className="w-9 h-9 object-cover rounded-md"
                      alt={item.name}
                      width={36}
                      height={36}
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-gray-500">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button asChild>
              <Link href="/cart">打开购物车</Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
