import { prisma } from '@/prisma/client';
import { omit } from 'lodash';
import restaurantsData from './seeds/restaurants.json';

const createRestaurants = async () =>
  Promise.all(
    restaurantsData.map(async (restaurant) =>
      prisma.restaurant.upsert({
        where: {
          googleMapsPlaceId: restaurant.googleMapsPlaceId,
        },
        update: {
          ...omit(restaurant, 'categories'),
          categories: {
            // Delete old categories
            deleteMany: {},
            create: await Promise.all(
              restaurant.categories.map(async (name) => ({
                category: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            ),
          },
        },
        create: {
          ...omit(restaurant, 'categories'),
          categories: {
            create: await Promise.all(
              restaurant.categories.map(async (name) => ({
                category: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            ),
          },
        },
      }),
    ),
  );

const main = async () => {
  const restaurants = await createRestaurants();
};

main().then(() => {
  prisma.$disconnect();
});
