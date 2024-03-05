import { getPlaceDetails } from '@/lib/google-maps';
import { prisma } from '@/prisma/client';

const main = async () => {
  const restaurants = await prisma.restaurant.findMany({
    where: { images: { isEmpty: true } },
  });

  console.warn(
    `${restaurants.length} restaurant${restaurants.length > 1 ? 's' : ''} missing images`,
  );

  for (const r of restaurants) {
    console.log('Adding images to', r.placeId, r.name);
    const data = await getPlaceDetails(r.placeId);
    const images = data.images;

    await prisma.restaurant.update({
      where: {
        placeId: r.placeId,
      },
      data: {
        images,
      },
    });
  }
};

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
