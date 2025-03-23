import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";

interface SearchBarProps<T> {
  url: string;
  renderFn: (item: T) => ReactNode;
  onSelectedChange: (item: T) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar = <T,>({ url, renderFn, onSelectedChange, className, placeholder }: SearchBarProps<T>) => {
  if (!renderFn) {
    throw new Error("Missing render function");
  }

  const { data, isError } = useQuery<T[]>({
    queryKey: ["search"],
    queryFn: async () => (await api.get(url)).data,
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(!!data);
  }, [data]);

  return (
    <Command className={className}>
      <CommandInput placeholder={placeholder} />
      {isOpen && (
        <CommandList>
          {isError && <CommandEmpty>Error loading results.</CommandEmpty>}
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {data?.map((item) => (
              <div key={JSON.stringify(item)} onClick={() => onSelectedChange(item)}>
                {renderFn(item)}
              </div>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
