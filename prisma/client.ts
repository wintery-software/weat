import { PrismaClient } from '@prisma/client';
import { pinyin } from 'pinyin-pro';

export const prisma = new PrismaClient().$extends({
  result: {
    category: {
      namePinyin: {
        needs: { name: true },
        compute: (category) => pinyin(category.name, { toneType: 'none' }),
      },
    },
  },
});
