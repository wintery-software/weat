'use client';

import LinkButton from '@/components/link_button';
import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

export default function Rating({
  className,
  clearable = true,
  max = 5,
  toggleable = true,
  value,
  onValueChange,
}: {
  className?: string;
  clearable?: boolean;
  max?: number;
  toggleable?: boolean;
  value: number;
  onValueChange?: Dispatch<SetStateAction<number>>;
}) {
  const [hover, setHover] = useState<number>();
  value = Math.floor(value);
  clearable = clearable && toggleable;

  return (
    <div className={cn(className, 'flex', 'flex-col', 'gap-2')}>
      <div>
        {Array.from({ length: max }, (_, i) => i + 1).map((star, index) => (
          <button
            key={index}
            onClick={() => toggleable && onValueChange && onValueChange(star)}
            onMouseEnter={() => toggleable && setHover(star)}
            onMouseLeave={() => toggleable && setHover(value)}
          >
            <StarIcon
              className={cn(
                'w-4',
                'h-4',
                star <= (hover || value) ? 'text-yellow-600 fill-yellow-500' : 'text-muted-foreground',
              )}
            />
          </button>
        ))}
      </div>
      {clearable && onValueChange && (
        <LinkButton
          onClick={() => {
            onValueChange(0);
            setHover(0);
          }}
        >
          清除
        </LinkButton>
      )}
    </div>
  );
}
