import { prisma } from '@/prisma/client';
import { omit } from 'lodash';

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').at(-2);

  const items = await prisma.restaurantItem.findMany({
    where: {
      restaurantId: id,
    },
    select: {
      id: true,
      name: true,
      altName: true,
      description: true,
      price: true,
      image: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const itemsByCategory = items.reduce((acc: any, item) => {
    if (!acc[item.category.name]) {
      acc[item.category.name] = [];
    }

    acc[item.category.name].push(omit(item, 'category'));
    return acc;
  }, {});

  return Response.json(itemsByCategory);
};
