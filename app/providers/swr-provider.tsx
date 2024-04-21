'use client';

import { fetchWeatApi, FetchWeatApiArgs } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { ReactNode } from 'react';
import { toast } from 'sonner';
import { SWRConfig } from 'swr';

const SWRProvider = ({ children }: { children: ReactNode }) => {
  const locale = useLocale();

  return (
    <SWRConfig
      value={{
        fetcher: (args: FetchWeatApiArgs) => {
          if (!Array.isArray(args)) {
            args = [args];
          }

          return fetchWeatApi(...args);
        },
        onError: (err, key) => {
          const now = new Date().toISOString();
          console.error(
            `%c[SWR]%c GET ${key}: ${err.message}`,
            'color: gray',
            'color: inherit',
          );
          toast.error('Fetch Error', {
            description: err.message,
          });
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;
