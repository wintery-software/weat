import { prisma } from '@/prisma/client';

export const search = async (query: string) => {
  query = query.trim().replaceAll(/\W+/g, ' ');

  return {
    restaurants: await searchRestaurants(query),
  };
};

const searchRestaurants = async (query: string, limit?: number) =>
  prisma.restaurant
    .findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            address: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      take: limit,
      orderBy: {
        name: 'asc',
      },
    })
    .then((result) =>
      result.map((restaurant) => ({
        ...restaurant,
        categories: restaurant.categories.map((c) => c.category.name),
      })),
    );
