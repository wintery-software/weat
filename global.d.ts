import { Restaurant as PrismaRestaurant } from '@prisma/client';

export declare global {
  type SortDirection = 'asc' | 'desc';

  type Restaurant = PrismaRestaurant & {
    categories: string[];
  };
}
