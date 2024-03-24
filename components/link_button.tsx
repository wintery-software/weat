import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export default function LinkButton({
  className,
  onClick,
  children,
}: {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      className={cn(
        className,
        'p-0 h-auto justify-start text-xs font-semibold text-link hover:underline-offset-1',
      )}
      variant="link"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
