'use client';

import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

export default function Rating({
  className,
  defaultValue = 0,
  max = 5,
  setValue,
  toggleable = true,
  value = 0,
}: {
  className?: string;
  defaultValue?: number;
  max?: number;
  setValue?: Dispatch<SetStateAction<any>>;
  toggleable?: boolean;
  value?: number;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className={className}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star, index) => (
        <button
          key={index}
          onClick={() => setValue && setValue(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(value)}
        >
          <StarIcon
            className={cn(
              'w-4 h-4',
              toggleable
                ? star <= (hover || value || defaultValue)
                  ? 'text-yellow-600 fill-yellow-500'
                  : 'text-muted-foreground'
                : 'text-yellow-600 fill-yellow-500',
            )}
          />
        </button>
      ))}
    </div>
  );
}
