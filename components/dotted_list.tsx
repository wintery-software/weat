import { cn } from '@/lib/utils';

type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type DottedListProps = {
  className?: string;
  items: string[];
  size?: TextSize;
};

export default function DottedList({ className, items, size }: DottedListProps) {
  return (
    <div className={cn('flex', 'flex-wrap', `text-${size}`, className)}>
      {items.map((item, index) => (
        <span key={index} className="after:content-['·'] last:after:content-none after:mx-1">
          {item}
        </span>
      ))}
    </div>
  );
}
