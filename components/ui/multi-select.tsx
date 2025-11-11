"use client";

import * as React from "react";
import { Check, ChevronDownIcon, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
}

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder,
}: MultiSelectProps) {
  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeChip = (val: string) => {
    onChange(value.filter((v) => v !== val));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full min-h-10 h-auto flex items-center flex-wrap gap-1 rounded-md border px-2 py-2 cursor-pointer border-black">
          {value.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}

          {value.map((val) => {
            const option = options.find((o) => o.value === val);
            if (!option) return null;
            return (
              <span
                key={val}
                className="bg-gray-200 text-gray-700 rounded-md px-2 py-0.5 text-xs flex items-center gap-1 pointer-events-none"
              >
                {option.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500 pointer-events-auto"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeChip(val);
                  }}
                />
              </span>
            );
          })}

          <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50 pointer-events-none" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-[var(--radix-popover-trigger-width)] p-0 z-[9999] bg-white border shadow-md rounded-md"
      >
        <Command>
          <CommandInput className="h-8 text-sm" placeholder="Search..." />
          <CommandList className="max-h-52 overflow-auto">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => toggleValue(opt.value)}
                    className="cursor-pointer text-sm hover:bg-gray-100 focus:bg-gray-100"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
