import { prisma } from '../client';

interface Data {
  restaurant: {
    name: string;
    place_id: string;
  };
  items: {
    name: string;
    alt_name?: string;
    category: string;
    price: number;
  }[];
}

const main = async () => {
  const path = process.argv[2];

  if (!path) {
    console.error('Usage: tsx bulk_add_restaurant_items.ts <file>');
    process.exit(1);
  }

  const { restaurant, items }: Data = JSON.parse(
    require('fs').readFileSync(path, 'utf-8'),
  );

  const r = await prisma.restaurant.findUnique({
    where: {
      name: restaurant.name,
      placeId: restaurant.place_id,
    },
  });

  if (!r) {
    console.error(
      `Restaurant(name=${restaurant.name},placeId=${restaurant.place_id}) not found`,
    );
    process.exit(1);
  }

  for (const item of items) {
    const i = await prisma.restaurantItem.findUnique({
      where: {
        restaurantId_name: {
          restaurantId: r.id,
          name: item.name,
        },
      },
    });

    if (i) {
      console.warn(`RestaurantItem(name=${item.name}) already exists`);
      continue;
    }

    console.log(`Creating RestaurantItem(name=${item.name})`);

    await prisma.restaurantItem.create({
      data: {
        name: item.name,
        altName: item.alt_name,
        price: item.price,
        category: {
          connectOrCreate: {
            where: {
              restaurantId_name: {
                restaurantId: r.id,
                name: item.category,
              },
            },
            create: {
              name: item.category,
              restaurant: {
                connect: {
                  id: r.id,
                },
              },
            },
          },
        },
        restaurant: {
          connect: {
            id: r.id,
          },
        },
      },
    });
  }
};

main().then(() => prisma.$disconnect());
