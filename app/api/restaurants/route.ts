import { RestaurantSortFieldsType, SortOrdersType } from '@/lib/constants';
import {
  calculateDistance,
  DistanceReturnType,
  isGoogleMapsApiEnabled,
} from '@/lib/google-maps';
import redis from '@/lib/redis';
import { prisma } from '@/prisma/client';
import { Prisma } from '@prisma/client';
import { compact, uniq } from 'lodash';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const categories = compact(uniq(params.getAll('category')));
  const prices = compact(uniq(params.getAll('price'))).map(Number);
  const rating = Number(params.get('rating')) || 0;
  const distance = Number(params.get('distance')) || 0;
  const origin = params.get('origin')?.split(',').map(Number);

  const limit = Number(params.get('limit'));
  const sortBy =
    (params.get('sort') as keyof RestaurantSortFieldsType) || 'rating';
  const order = (params.get('order') as keyof SortOrdersType) || 'desc';

  const where: Prisma.RestaurantWhereInput = {};

  if (categories.length) {
    where.categories = {
      some: {
        category: {
          name: {
            in: categories,
          },
        },
      },
    };
  }

  if (prices.length) {
    where.price = {
      in: prices,
    };
  }

  if (rating) {
    where.rating = {
      gte: rating,
    };
  }

  const result = await prisma.restaurant.findMany({
    where,
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
    // LIMIT is optional
    ...(limit ? { take: limit } : {}),
    ...(sortBy !== 'distance'
      ? {
          orderBy: [
            { [sortBy]: order },
            { rating: 'desc' },
            { price: 'asc' },
            { name: 'asc' },
          ],
        }
      : {}),
  });

  const googleMapsApiEnabled = isGoogleMapsApiEnabled();

  let processedResult = await Promise.all(
    result.map(async (restaurant) => {
      let calculated: DistanceReturnType | null = null;

      if (
        googleMapsApiEnabled &&
        origin &&
        (distance || sortBy === 'distance')
      ) {
        const client = await redis();
        const key = `coordinate:${origin.join(',')}`;

        try {
          const cache = await client.hGet(key, restaurant.placeId);

          // First time fetching distance from this location
          if (cache) {
            const [cachedDistance, cachedDuration] = cache
              .split(',')
              .map(Number);

            calculated = {
              distance: cachedDistance,
              duration: cachedDuration,
            };
          } else {
            calculated = await calculateDistance(
              origin as [number, number],
              restaurant.placeId,
            );

            // Cache for 1 day
            await client.hSet(
              key,
              restaurant.placeId,
              `${calculated.distance},${calculated.duration}`,
            );
            await client.expire(key, 60 * 60 * 24);
          }
        } finally {
          await client.disconnect();
        }
      }

      return {
        ...restaurant,
        distance: calculated,
        categories: restaurant.categories.map((c) => c.category.name),
      };
    }),
  );

  if (distance) {
    processedResult = processedResult.filter(
      (r) => r.distance && r.distance.distance <= distance,
    );
  }

  if (googleMapsApiEnabled && sortBy === 'distance') {
    processedResult = processedResult.sort((a, b) => {
      if (!a.distance || !b.distance) return 0;

      return order === 'asc'
        ? a.distance.distance - b.distance.distance
        : b.distance.distance - a.distance.distance;
    });
  }

  return Response.json(processedResult);
}
