import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { getS3PlacePhotoUrl } from '@/lib/aws-s3';
import { search } from '@/lib/utils';
import { capitalize, isEmpty } from 'lodash';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type SearchResultType = Record<string, any[]>;

export default function SearchDialog({
  placeholder,
  open,
  onOpenChange,
}: {
  placeholder?: string;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<SearchResultType>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      search(query.trim()).then((data) => {
        setResult(data);
        setLoading(false);
      });
    } else {
      // No need to search if query is empty
      setResult({});
    }
  }, [query]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      className="top-[25%] md:top-[50%]"
    >
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder={placeholder || '搜索...'}
      />
      <CommandList>
        {query && loading && <CommandEmpty>加载中...</CommandEmpty>}
        {query && isEmpty(result) && !loading && (
          <CommandEmpty>没有结果</CommandEmpty>
        )}
        {Object.entries(result).map(([type, items]) => (
          <CommandGroup key={type} heading={capitalize(type)} forceMount>
            {items.map((item) => (
              <Link href={`/${type}/${item.id}`} key={item.id}>
                <CommandItem value={item.id}>
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage
                        src={getS3PlacePhotoUrl(item.placeId, item.images[0])}
                        alt={item.name}
                      />
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <div className="font-semibold">
                        <span className="mr-2">{item.name}</span>
                        <span className="inline-flex gap-1">
                          {item.categories.map((category: string) => (
                            <Badge key={category} className="px-1 py-0">
                              {category}
                            </Badge>
                          ))}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.address}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
