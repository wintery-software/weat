import { prisma } from '../client';

interface Data {
  placeId: string;
  menu: {
    category: {
      name: string;
      name_zh?: string;
    };
    items: {
      name: string;
      name_zh?: string;
      price: number;
    }[];
  }[];
}

const main = async () => {
  const path = process.argv[2];

  if (!path) {
    console.error('Usage: tsx bulk_add_restaurant_items.ts <file>');
    process.exit(1);
  }

  const { placeId, menu }: Data = JSON.parse(
    require('fs').readFileSync(path, 'utf-8'),
  );

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      placeId,
    },
  });

  if (!restaurant) {
    console.error(`Restaurant(placeId=${placeId}) not found`);
    process.exit(1);
  }

  for (const m of menu) {
    const category = await prisma.restaurantItemCategory.upsert({
      where: {
        restaurantId_name: {
          restaurantId: restaurant.id,
          name: m.category.name,
        },
      },
      update: {
        nameZh: m.category.name_zh,
      },
      create: {
        name: m.category.name,
        nameZh: m.category.name_zh,
        restaurant: {
          connect: {
            id: restaurant.id,
          },
        },
      },
    });

    for (const item of m.items) {
      console.log(
        `Creating RestaurantItem(category="${category.name}",name="${item.name}")`,
      );

      await prisma.restaurantItem.upsert({
        where: {
          restaurantId_categoryId_name: {
            restaurantId: restaurant.id,
            categoryId: category.id,
            name: item.name,
          },
        },
        update: {
          nameZh: item.name_zh,
          price: item.price,
        },
        create: {
          name: item.name,
          nameZh: item.name_zh,
          price: item.price,
          category: {
            connect: {
              id: category.id,
            },
          },
          restaurant: {
            connect: {
              id: restaurant.id,
            },
          },
        },
      });
    }
  }
};

main().then(() => prisma.$disconnect());
