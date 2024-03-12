import { prisma } from '@/prisma/client';

export async function GET(request: Request) {
  const result = await prisma.restaurantCategory
    .findMany({
      select: {
        name: true,
        namePinyin: true,
      },
    })
    .then((result) => {
      // Prisma does not support order by computed values
      return result.sort((a, b) => a.namePinyin.localeCompare(b.namePinyin));
    });

  return Response.json(result);
}
