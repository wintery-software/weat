import { prisma } from '@/prisma/client';

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  return Response.json(restaurant);
};
