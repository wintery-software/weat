'use client';

import {
  StandardLayout,
  StandardLayoutBradcrumb,
  StandardLayoutDescription,
  StandardLayoutHeader,
  StandardLayoutTitle,
} from '@/app/layouts/standard_layout';
import { RestaurantItem } from '@prisma/client';
import { useState } from 'react';

const Page = () => {
  const [items, setItems] = useState<RestaurantItem[]>([]);

  return (
    <StandardLayout>
      <StandardLayoutHeader>
        <StandardLayoutBradcrumb current="购物车" />
        <StandardLayoutTitle>购物车</StandardLayoutTitle>
        <StandardLayoutDescription>
          {items.length} 件商品
        </StandardLayoutDescription>
      </StandardLayoutHeader>
    </StandardLayout>
  );
};

export default Page;
