'use client';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { search } from '@/lib/utils';
import { useEffect, useState } from 'react';

type SearchResultType = Record<string, any[]>;

export function SearchBar({ placeholder }: { placeholder?: string }) {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<SearchResultType>({});

  const handleSearch = (query: string, type?: string) => {
    search(query, type).then(setResult);
  };

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
            handleSearch(value);
          }
        }}
        // placeholder={placeholder || '搜索...'}
        placeholder={'技能冷却中...'}
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
