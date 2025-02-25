"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import * as React from "react";
import { useEffect, useState } from "react";

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const getRestaurants = async () => {
    try {
      const response = await fetch("/api/restaurants");
      return await response.json();
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    getRestaurants().then((data) => {
      setRestaurants(data);
    });
  }, []);

  return (
    <Command className="sm:w-96">
      <CommandInput
        placeholder="Search restaurant..."
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      />
      <CommandList>
        {open ? (
          <>
            <CommandEmpty>No restaurant found.</CommandEmpty>
            <CommandGroup>
              {restaurants.map((r) => (
                <CommandItem
                  key={r.id}
                  value={r.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-sm text-gray-500">{r.address}</p>
                    {r.cuisine && (
                      <div className="space-x-2">
                        <Badge>{r.cuisine}</Badge>
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </Command>
  );
};
