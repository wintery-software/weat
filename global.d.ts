import { DistanceReturnType } from '@/lib/google_maps';
import { Restaurant as PrismaRestaurant } from '@prisma/client';

export declare global {
  type Restaurant = PrismaRestaurant & {
    categories: string[];
    distance: Omit<DistanceReturnType, 'origin' | 'destination'>;
  };
}
