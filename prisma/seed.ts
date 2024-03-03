import { getPlaceDetails, uploadPlacePhotoToS3 } from '@/lib/google_maps';
import { prisma } from '@/prisma/client';
import restaurantsData from './seeds/restaurants.json';

const createRestaurants = async () =>
  Promise.all(
    restaurantsData.map(async (r) => {
      const categories = await Promise.all(
        r.categories.map((name) => {
          return prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
          });
        }),
      );

      const place = await getPlaceDetails(r.place_id);

      place.images = await Promise.all(
        (place.images as string[]).map(async (ref) => {
          const path = await uploadPlacePhotoToS3(r.place_id, ref);
          console.log('Uploaded:', path);
          return path;
        }),
      );

      const createInput = {
        ...place,
        altName: r.alt_name,
        // Delete all old categories and create new ones
        categories: {
          create: categories.map((c) => ({ categoryId: c.id })),
        },
      };

      const updateInput = {
        ...createInput,
        categories: {
          deleteMany: {},
          ...createInput.categories,
        },
      };

      return prisma.restaurant.upsert({
        where: {
          placeId: r.place_id,
        },
        update: updateInput,
        create: createInput,
      });
    }),
  );

const main = async () => {
  console.log('Seeding restaurants...');
  const restaurants = await createRestaurants();
};

main().then(() => {
  prisma.$disconnect();
});
