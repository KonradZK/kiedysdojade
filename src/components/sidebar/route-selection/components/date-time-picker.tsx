import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface DateTimePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, onDateChange }: DateTimePickerProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (date) {
      const [hours, minutes] = e.target.value.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours));
      newDate.setMinutes(parseInt(minutes));
      onDateChange(newDate);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setIsVisible(!isVisible)}
        >
          <Clock className="h-4 w-4 mr-2" />
          {isVisible ? "Ukryj datę" : "Wybierz datę"}
        </Button>
      </div>

      {isVisible && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP HH:mm") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
            />
            <div className="p-3 border-t border-border">
              <input
                type="time"
                className="w-full p-2 border rounded-md bg-background text-foreground"
                value={date ? format(date, "HH:mm") : ""}
                onChange={handleTimeChange}
              />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
