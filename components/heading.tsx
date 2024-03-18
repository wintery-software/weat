import { Heading } from '@radix-ui/themes';

export const H1 = ({
  children,
  className,
}: {
  children: any;
  className?: string;
}) => (
  <Heading size="6" className={className}>
    {children}
  </Heading>
);

export const H2 = ({
  children,
  className,
}: {
  children: any;
  className?: string;
}) => (
  <Heading size="5" className={className}>
    {children}
  </Heading>
);

export const H3 = ({
  children,
  className,
}: {
  children: any;
  className?: string;
}) => (
  <Heading size="4" className={className}>
    {children}
  </Heading>
);

export const H4 = ({
  children,
  className,
}: {
  children: any;
  className?: string;
}) => (
  <Heading size="3" className={className}>
    {children}
  </Heading>
);
