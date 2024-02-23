'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { search } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

type SearchResultType = Record<string, any[]>;

export function SearchBar({ placeholder }: { placeholder?: string }) {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<SearchResultType>({});
  const abortControllerRef = useRef<AbortController>();

  const handleSearch = async (query: string, type?: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the new request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const result = await search(query, type, signal);
    setResult(result);
  };

  const debouncedSearch = useDebounceCallback(handleSearch, 500);

  useEffect(() => {
    if (!query || query === '') {
      setResult({});
    }
  }, [query]);

  return (
    <Command shouldFilter={false}>
      <CommandInput
        value={query}
        onValueChange={(value) => {
          setQuery(value);

          if (value === '' || !value) {
            setResult({});
          } else {
            debouncedSearch(value);
          }
        }}
        placeholder={placeholder || '搜索...'}
      />
      {result && (
        <CommandList>
          {query !== '' && <CommandEmpty>No results found</CommandEmpty>}
          {Object.entries(result).map(([type, data]) => (
            <CommandGroup key={type} heading={type}>
              {data.map((item, index) => (
                <CommandItem key={index}>{item.name}</CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      )}
    </Command>
  );
}
