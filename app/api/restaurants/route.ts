import { RestaurantSortKey } from '@/app/restaurants/_sort';
import { SortOrder } from '@/components/sort_select';
import {
  calculateDistance,
  DistanceReturnType,
  isGoogleMapsApiEnabled,
} from '@/lib/google-maps';
import redis from '@/lib/redis';
import { sleep } from '@/lib/utils';
import { prisma } from '@/prisma/client';
import { Prisma } from '@prisma/client';
import { compact, omit, uniq } from 'lodash';

export const GET = async (request: Request) => {
  await sleep(1000);
  const url = new URL(request.url);
  const params = url.searchParams;

  const categories = compact(uniq(params.getAll('category')));
  const prices = compact(uniq(params.getAll('price'))).map(Number);
  const rating = Number(params.get('rating')) || 0;
  const distance = Number(params.get('distance')) || 0;
  const origin = params.get('origin')?.split(',').map(Number);

  const limit = Number(params.get('limit'));
  const sortBy = (params.get('sort') as RestaurantSortKey) || 'relevance';
  const order = (params.get('order') as SortOrder) || 'desc';

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

  const result = (
    await prisma.restaurant.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        items: {
          select: {
            id: true,
          },
        },
      },
      // LIMIT is optional
      ...(limit ? { take: limit } : {}),
      ...(sortBy !== 'distance'
        ? {
            orderBy: [
              sortBy === 'relevance' ? {} : { [sortBy]: order },
              { rating: 'desc' },
              { price: 'asc' },
              { name: 'asc' },
            ],
          }
        : {}),
    })
  ).map((r) => ({
    ...r,
    images: r.images.slice(0, 1),
  }));

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
    return Response.json(
      processedResult.sort((a, b) => {
        if (!a.distance || !b.distance) return 0;

        return order === 'asc'
          ? a.distance.distance - b.distance.distance
          : b.distance.distance - a.distance.distance;
      }),
    );
  } else if (sortBy === 'relevance') {
    return Response.json(
      processedResult
        .sort((a, b) => {
          if (a.items.length === b.items.length) return 0;

          return order === 'asc'
            ? a.items.length - b.items.length
            : b.items.length - a.items.length;
        })
        .map((r) => omit(r, 'items')),
    );
  }

  return Response.json(processedResult);
};
