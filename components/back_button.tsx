'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const BackButton = (props: ButtonProps) => {
  const router = useRouter();

  return (
    <Button
      {...props}
      onClick={() => {
        router.back();
      }}
    >
      {props.children}
    </Button>
  );
};

export default BackButton;
