import { prisma } from '@/prisma/client';

export async function GET() {
  const result = await prisma.category.findMany({
    select: {
      name: true,
    },
  });

  return Response.json(result);
}
