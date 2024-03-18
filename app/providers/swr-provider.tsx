'use client';

import { fetcher } from '@/lib/utils';
import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

const SWRProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;
