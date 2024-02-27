import { prisma } from '@/prisma/client';
import { Prisma } from '@prisma/client';
import { compact, uniq } from 'lodash';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const categories = compact(uniq(params.getAll('category')));
  const prices = compact(uniq(params.getAll('price'))).map(Number);
  const rating = Number(params.get('rating')) || 0;
  const distance = Number(params.get('distance')) || 0;
  const origin = params.get('origin');

  const limit = Number(params.get('limit'));
  const order = (params.get('order') as keyof Restaurant) || 'rating';
  const sort = (params.get('sort') as SortDirection) || 'desc';

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

  const result = await prisma.restaurant
    .findMany({
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
      orderBy: [{ [order]: sort }, { name: 'asc' }],
    })
    .then((result) =>
      result.map((restaurant) => ({
        ...restaurant,
        categories: restaurant.categories.map((c) => c.category.name),
      })),
    );

  return Response.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ message: 'success' });
}
