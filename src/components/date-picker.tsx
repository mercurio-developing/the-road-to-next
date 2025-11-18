"use client";

import * as React from "react";
import { format } from "date-fns";
import { LucideCalendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useImperativeHandle, useState } from "react";

export type ImperativeHandleFromDatePicker = { reset: () => void } | null

type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string | undefined;
  imperativeHandlerRef: React.RefObject<ImperativeHandleFromDatePicker>;
};

const DatePicker = ({
  id,
  name,
  defaultValue,
  imperativeHandlerRef,
}: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : new Date(),
  );
  const [open, setOpen] = useState(false);

  useImperativeHandle(imperativeHandlerRef, () => ({
    reset: () => {
      setDate(new Date());
    },
  }));

  const handleSelect = (selectDate: Date | undefined) => {
    setDate(selectDate);
    setOpen(false);
  };

  const formatedStringDate = date ? format(date, "yyyy-MM-dd") : "";
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full" id={id} asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="justify-start text-left font-normal"
        >
          <LucideCalendar />
          {formatedStringDate}
          <input hidden name={name} defaultValue={formatedStringDate} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
};
export { DatePicker };
