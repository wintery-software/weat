import { NotFound } from '@/lib/response';
import { prisma } from '@/prisma/client';
import { RestaurantItem } from '@prisma/client';

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      categories: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      items: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!restaurant) {
    return NotFound(`Restaurant(id=${id}) not found`);
  }

  const result = {
    ...restaurant,
    categories: restaurant.categories.map((c) => c.category.name),
    items: restaurant.items.reduce(
      (
        acc: Record<
          string,
          Omit<RestaurantItem, 'restaurantId' | 'categoryId'>[]
        >,
        item,
      ) => {
        const { category, restaurantId, categoryId, ...rest } = item;
        const name = `${category.name}${category.nameZh ? ` ${category.nameZh}` : ''}`;
        acc[name] = acc[name] || [];
        acc[name].push(rest);
        return acc;
      },
      {},
    ),
  };

  return Response.json(result);
};
