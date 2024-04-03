import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconShoppingCart } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

const NavbarCart = ({ items }: { items: any[] }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" asChild>
        <p className="flex gap-1 items-center">
          <IconShoppingCart size={16} />
          {items.length}
        </p>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80">
      <div className="flex flex-col gap-4">
        {items.length ? (
          <ScrollArea className="w-full max-h-60">
            <div className="flex flex-col gap-1">
              {items.map((item, index) => (
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
        ) : (
          <div className="flex justify-center align-middle text-sm text-gray-500 py-4">
            购物车是空的
          </div>
        )}
        <Button asChild>
          <Link href="/components/navbar/cart">打开购物车</Link>
        </Button>
      </div>
    </PopoverContent>
  </Popover>
);

export default NavbarCart;
