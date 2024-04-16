import { ReactNode } from 'react';

interface KBDProps {
  children: ReactNode;
}

const KBD = ({ children }: KBDProps) => (
  <kbd className="pointer-events-none select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] opacity-100">
    {children}
  </kbd>
);

export default KBD;
