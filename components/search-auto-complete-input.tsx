import { Input } from "@/components/ui/input";
import { LucideLoaderCircle, LucideSearch } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface SearchAutoCompleteInputProps<T> {
  isLoading?: boolean;
  items: T[];
  renderItem: (item: T) => ReactNode;
  onItemSelect: (item: T) => void;
}

export const SearchAutoCompleteInput = <T,>({
  isLoading,
  items,
  renderItem,
  onItemSelect,
  ...props
}: SearchAutoCompleteInputProps<T> & ComponentProps<"input">) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const open = isFocused && !!props.value;

  // click-away handler
  useEffect(() => {
    const handleBlur = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleBlur);

    return () => {
      document.removeEventListener("mousedown", handleBlur);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <Input
        className="peer pe-9 ps-9"
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        {...props}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground/80">
        {isLoading ? (
          <LucideLoaderCircle className="animate-spin" size={16} role="status" />
        ) : (
          <LucideSearch size={16} />
        )}
      </div>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 max-h-96 w-full overflow-y-auto rounded-md border border-input bg-popover shadow"
          data-state={open ? "open" : "closed"}
        >
          {items.length === 0 && !isLoading ? (
            <div className="flex h-16 items-center justify-center text-sm text-muted-foreground">No results found</div>
          ) : (
            items.map((item, i) => (
              <div
                key={i}
                onMouseDown={() => onItemSelect(item)}
                className="cursor-pointer px-4 py-2 hover:bg-accent hover:text-accent-foreground"
              >
                {renderItem(item)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
