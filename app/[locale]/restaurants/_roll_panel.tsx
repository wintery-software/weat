'use client';

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
import { Link } from '@/lib/i18n/navigation';
import { IconCoin, IconLoader2 } from '@tabler/icons-react';
import { isEmpty, sample } from 'lodash';
import Image from 'next/image';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

interface RollPanelProps {
  items: any[];
  children: ReactNode;
}

const RollPanel = ({ items, children }: RollPanelProps) => {
  const [selected, setSelected] = useState<Restaurant | null>();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const defaultTimeout = 1000;

  const random = (items: any[], timeout: number) => {
    setSelected(null);

    setTimeout(() => {
      setSelected(sample(items));
    }, timeout);
  };

  useEffect(() => {
    if (isEmpty(items)) return;
    random(items, defaultTimeout);
  }, [items]);

  const content = useMemo(() => {
    return (
      <figure className="flex flex-col shrink-0 gap-1">
        <Link href={`/restaurants/${selected?.id}`}>
          {selected ? (
            <Image
              src={getS3PlacePhotoUrl(
                selected.google_place_id,
                selected.images?.[0],
                '1024x768',
              )}
              alt={selected.name}
              width={320}
              height={180}
              sizes="100vw"
              className="aspect-video object-cover rounded"
            />
          ) : (
            <Skeleton className="aspect-video w-80" />
          )}
        </Link>
        <figcaption className="flex flex-col w-80">
          {selected ? (
            <Link
              href={`/restaurants/${selected.id}`}
              className="text-sm font-medium hover:underline truncate"
            >
              {selected.name}
            </Link>
          ) : (
            <div className="flex items-center h-5">
              <Skeleton className="w-1/2 h-[14px]" />
            </div>
          )}
          {selected ? (
            <Link
              href={`#`}
              className="text-xs text-muted-foreground hover:underline truncate"
            >
              {selected.address}
            </Link>
          ) : (
            <div className="flex items-center h-4">
              <Skeleton className="w-3/4 h-[12px]" />
            </div>
          )}
        </figcaption>
      </figure>
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-auto">
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
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>{/* Intentionally leave blank */}</DrawerHeader>
        <div className="flex justify-center">{content}</div>
        <DrawerFooter className="pb-8">
          <RollButton />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RollPanel;
