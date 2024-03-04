import { getPlaceDetails } from '@/lib/google-maps';
import { prisma } from '@/prisma/client';
import { Prisma } from '@prisma/client';

const updateRestaurant = async () => {
  const restaurants = await prisma.restaurant.findMany({});

  const data: Awaited<Prisma.RestaurantCreateInput>[] = await Promise.all(
    restaurants.map(async (r) => {
      return getPlaceDetails(r.placeId);
    }),
  );

  for (const r of data) {
    await prisma.restaurant.update({
      where: {
        placeId: r.placeId,
      },
      data: r,
    });
  }
};
