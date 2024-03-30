'use client';

import { RestaurantType } from '@/app/[locale]/restaurants/page';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { getS3PlacePhotoUrl } from '@/lib/aws-s3';
import { IconCoin, IconLoader2, IconSoup } from '@tabler/icons-react';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

const RollPanel = ({ items }: { items: any[] }) => {
  const [selected, setSelected] = useState<RestaurantType | null>();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const defaultTimeout = 1000;

  const random = (items: any[], timeout: number) => {
    setSelected(null);

    setTimeout(() => {
      const r = items[Math.floor(Math.random() * items.length)];
      setSelected(r);
    }, timeout);
  };

  useEffect(() => {
    if (isEmpty(items)) {
      return;
    }

    random(items, defaultTimeout);
  }, [items]);

  const content = useMemo(() => {
    return (
      <Link
        href={`/restaurants/${selected?.id}`}
        className="flex flex-col items-center mx-auto gap-2 w-64 min-h-64"
      >
        {selected ? (
          <img
            src={getS3PlacePhotoUrl(selected.placeId, selected.images?.[0])}
            alt={selected.name}
            className="w-64 h-64 rounded-sm object-cover"
          />
        ) : (
          <Skeleton className="w-full h-64" />
        )}
        <div className="self-start w-full">
          {selected ? (
            <p className="text-sm font-bold">{selected.name}</p>
          ) : (
            <div className="h-5">
              <Skeleton className="h-4" />
            </div>
          )}
          {selected ? (
            <p className="text-xs text-gray-500">{selected.address}</p>
          ) : (
            <div className="h-4">
              <Skeleton className="h-3" />
            </div>
          )}
        </div>
      </Link>
    );
  }, [selected]);

  if (!items) {
    return;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const RollButton = () => (
    <Button
      variant="outline"
      className="w-full flex gap-2"
      disabled={!selected}
      onClick={() => {
        random(items, defaultTimeout);
      }}
    >
      再来一次
      <div className="flex">
        <IconCoin size={20} />1
      </div>
      {!selected && <IconLoader2 className="animate-spin" size={16} />}
    </Button>
  );

  return isDesktop ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-1 bg-orange-600 hover:bg-orange-600/90">
          <IconSoup size={16} />
          今天吃什么
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DrawerTitle>今天吃...</DrawerTitle>
        </DialogHeader>
        {content}
        <DialogFooter>
          <RollButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex gap-1 bg-orange-600 hover:bg-orange-600/90">
          <IconSoup size={16} />
          今天吃什么
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>今天吃...</DrawerTitle>
        </DrawerHeader>
        {content}
        <DrawerFooter className="pb-8">
          <RollButton />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RollPanel;
