import { prisma } from '@/prisma/client';

export async function GET() {
  const result = await prisma.category
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
