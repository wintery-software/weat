import { cn } from '@/lib/utils';

type DottedListProps = {
  className?: string;
  items: string[];
};

const DottedList = ({ className, items }: DottedListProps) => (
  <div className={cn('flex', 'flex-wrap', className)}>
    {items.map((item, index) => (
      <span
        key={index}
        className="after:content-['·'] last:after:content-none after:mx-1"
      >
        {item}
      </span>
    ))}
  </div>
);

export default DottedList;
