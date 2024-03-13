import { prisma } from '@/prisma/client';
import { uniq } from 'lodash';
import restaurantItemsData from './seeds/restaurant_items.json';
import restaurantsData from './seeds/restaurants.json';

const checkDuplicate = (arr: any[], key: string): string => {
  const seen = new Set();

  for (const item of arr) {
    if (seen.has(item[key])) {
      return item[key];
    }
    seen.add(item[key]);
  }

  return '';
};

const createRestaurants = async () => {
  const duplicate = checkDuplicate(restaurantsData, 'place_id');

  if (duplicate) {
    throw new Error(`Duplicate place_id in restaurants.json: ${duplicate}`);
  }

  // Collect unique categories and create them
  const categories = await Promise.all(
    uniq(restaurantsData.flatMap((r) => r.categories)).map(async (name) => {
      console.log('Creating category:', name);
      return await prisma.restaurantCategory.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }),
  );

  return Promise.all(
    restaurantsData.map(async (r) => {
      const createInput = {
        ...r,
        categories: {
          create: r.categories.map((c) => {
            return {
              categoryId: categories.find((cat) => cat.name === c)?.id!,
            };
          }),
        },
      };

      const updateInput = {
        ...r,
        categories: {
          // Delete all old categories and create new ones
          deleteMany: {},
          ...createInput.categories,
        },
      };

      console.log('Creating restaurant:', r.name, `(${r.address})`);

      return prisma.restaurant.upsert({
        where: {
          placeId: r.placeId,
        },
        update: updateInput,
        create: createInput,
      });
    }),
  );
};

const createRestaurantItems = async () => {
  const data = [];

  for (const item of restaurantItemsData) {
    console.log(
      `Creating restaurant item: ${item.restaurant.name} > ${item.category} > ${item.name}`,
    );

    const restaurant = await prisma.restaurant.findUnique({
      where: item.restaurant,
    });

    if (!restaurant) {
      throw new Error(
        `Restaurant with place_id ${item.restaurant.placeId} not found`,
      );
    }

    const category = await prisma.restaurantItemCategory.upsert({
      where: {
        restaurantId_name: {
          restaurantId: restaurant.id,
          name: item.category,
        },
      },
      update: {},
      create: {
        name: item.category,
        restaurant: {
          connect: {
            id: restaurant.id,
          },
        },
      },
    });

    data.push(
      await prisma.restaurantItem.upsert({
        where: {
          restaurantId_name: {
            restaurantId: restaurant.id,
            name: item.name,
          },
        },
        update: {},
        create: {
          ...item,
          restaurant: {
            connect: {
              id: restaurant.id,
            },
          },
          category: {
            connect: {
              id: category.id,
            },
          },
        },
      }),
    );
  }

  return data;
};

const main = async () => {
  console.log('Seeding restaurants');
  const restaurants = await createRestaurants();
  console.log(`${restaurants.length} restaurants seeded`);

  const restaurantItems = await createRestaurantItems();
  console.log(`${restaurantItems.length} restaurant items seeded`);
};

main().then(() => {
  prisma.$disconnect();
});
