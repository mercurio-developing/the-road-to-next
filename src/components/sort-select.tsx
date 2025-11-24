"use client";

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";

export type SortSelectOption = {
  label: string;
  sortValue: string;
  sortKey: string;
};

type SortObject = { sortValue: string; sortKey: string };

type SortSelectProps = {
  options: SortSelectOption[];
  value: SortObject;
  onChange: (value: SortObject) => void;
};

const SortSelect = ({ options, onChange, value }: SortSelectProps) => {
  const handleSort = (compositionKey: string) => {
    const [sortKey, sortValue] = compositionKey.split("_");
    onChange({ sortKey, sortValue });
  };

  return (
    <Select
      onValueChange={handleSort}
      defaultValue={value.sortKey + "_" + value.sortValue}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.sortKey + option.sortValue}
              value={option.sortKey + "_" + option.sortValue}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export { SortSelect };
