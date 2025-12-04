import { useState, useMemo, useRef } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item } from "@/components/ui/item";
import type { Groupnames } from "@/types/stop";

interface RouteSelectionProps {
  group: Array<Groupnames>;
  onSelect: (start: string, end: string, intermediate?: string) => void;
  disabled?: boolean;
}


// type item -> type groupnames
export const RouteSelection: React.FC<RouteSelectionProps> = ({
  group,
  onSelect,
  disabled = false,
}) => {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [intermediateInput, setIntermediateInput] = useState("");
  const [showIntermediate, setShowIntermediate] = useState(false);
  const [focused, setFocused] = useState<"start" | "end" | "intermediate" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hoveredName, setHoveredName] = useState<string>("");
  const [selectedStart, setSelectedStart] = useState<{
      group_code: string;
      group_name: string;
    // code: string;
    // name: string;
  } | null>(null);
  const [selectedIntermediate, setSelectedIntermediate] = useState<{
    group_code: string;
    group_name: string;
  } | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<{
    group_code: string;
    group_name: string;
    // code: string;
    // name: string;
  } | null>(null);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (date) {
      const [hours, minutes] = e.target.value.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours));
      newDate.setMinutes(parseInt(minutes));
      setDate(newDate);
    }
  };

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const intermediateInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const startSuggestions = useMemo(() => {
    if (!startInput) return [];
    return group
      .filter((item) =>
        item.group_name?.toLowerCase().includes(startInput.toLowerCase())
      )
      .slice(0, 8);
  }, [startInput, group]);

  const endSuggestions = useMemo(() => {
    if (!endInput) return [];
    return group
      .filter((item) =>
        item.group_name?.toLowerCase().includes(endInput.toLowerCase())
      )
      .slice(0, 8);
  }, [endInput, group]);

  const intermediateSuggestions = useMemo(() => {
    if (!intermediateInput) return [];
    return group
      .filter((item) =>
        item.group_name?.toLowerCase().includes(intermediateInput.toLowerCase())
      )
      .slice(0, 8);
  }, [intermediateInput, group]);

  const suggestions =
    focused === "start"
      ? startSuggestions
      : focused === "end"
      ? endSuggestions
      : intermediateSuggestions;

  const setInputValue =
    focused === "start"
      ? setStartInput
      : focused === "end"
      ? setEndInput
      : setIntermediateInput;

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!focused || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => {
        const next = Math.min(prev + 1, suggestions.length - 1);
        setHoveredName(suggestions[next]?.group_name || "");
        return next;
      });
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => {
        const next = Math.max(prev - 1, 0);
        setHoveredName(suggestions[next]?.group_name || "");
        return next;
      });
      e.preventDefault();
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      const selected = suggestions[selectedIndex];
      setInputValue(selected.group_name);
      setHoveredName("");
      setSelectedIndex(-1);
      setFocused(null);
      if (focused === "start") {
        setSelectedStart(selected);
        if (showIntermediate && intermediateInputRef.current) {
          intermediateInputRef.current.focus();
        } else if (endInputRef.current) {
          endInputRef.current.focus();
        }
      } else if (focused === "intermediate") {
        setSelectedIntermediate(selected);
        if (endInputRef.current) endInputRef.current.focus();
      } else if (focused === "end") {
        setSelectedEnd(selected);
        if (searchButtonRef.current) searchButtonRef.current.focus();
      }
    }
  };

  const handleFocus = (type: "start" | "end" | "intermediate") => {
    if (disabled) return;
    setFocused(type);
    setSelectedIndex(-1);
    setHoveredName("");
  };

  const handleBlur = (type: "start" | "end" | "intermediate") => {
    setFocused(null);
    if (type === "start") {
      const selected =
        selectedIndex >= 0
          ? startSuggestions[selectedIndex]
          : startSuggestions[0];
      if (selected) {
        setStartInput(selected.group_name);
        setSelectedStart(selected);
      }
    } else if (type === "end") {
      const selected =
        selectedIndex >= 0 ? endSuggestions[selectedIndex] : endSuggestions[0];
      if (selected) {
        setEndInput(selected.group_name);
        setSelectedEnd(selected);
      }
    } else if (type === "intermediate") {
      const selected =
        selectedIndex >= 0
          ? intermediateSuggestions[selectedIndex]
          : intermediateSuggestions[0];
      if (selected) {
        setIntermediateInput(selected.group_name);
        setSelectedIntermediate(selected);
      }
    }
  };

  const addIntermediate = () => {
    if (!intermediates.length || intermediates[intermediates.length - 1] !== "") {
      setIntermediates([...intermediates, ""]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Start */}
      <Input
        ref={startRef}
        placeholder="Skąd?"
        value={startInput}
        onChange={(e) => setStartInput(e.target.value)}
        onFocus={() => {
          setFocused("start");
          setSelectedIndex(0);
        }}
        onBlur={() => setFocused(null)}
        onKeyDown={(e) => handleKeyDown(e, "start")}
        disabled={disabled}
      />

      {/* End */}
      <Input
        ref={endRef}
        placeholder="Dokąd?"
        value={endInput}
        onChange={(e) => setEndInput(e.target.value)}
        onFocus={() => {
          setFocused("end");
          setSelectedIndex(0);
        }}
        onBlur={() => setFocused(null)}
        onKeyDown={(e) => handleKeyDown(e, "end")}
        disabled={disabled}
      />

      {/* Przystanki pośrednie */}
      {intermediates.map((val, idx) => (
        <Input
          key={idx}
          placeholder={`Przystanek pośredni ${idx + 1}`}
          value={val}
          onChange={(e) => setInputValue("intermediate", e.target.value, idx)}
          onFocus={() => {
            setFocused("intermediate");
            setActiveIntermediate(idx);
            setSelectedIndex(0);
          }}
          onFocus={() => handleFocus("start")}
          onBlur={() => handleBlur("start")}
          onKeyDown={focused === "start" ? handleInputKeyDown : undefined}
          className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-500 ease-in-out font-medium focus-visible:text-xl"
        />
      </div>
      
      {showIntermediate && (
        <div className="flex flex-col gap-2 relative">
          <Input
            id="intermediate"
            ref={intermediateInputRef}
            disabled={disabled}
            placeholder="Przez?"
            value={
              focused === "intermediate" && hoveredName
                ? hoveredName
                : intermediateInput
            }
            onChange={(e) => {
              setIntermediateInput(e.target.value);
              setHoveredName("");
              setSelectedIndex(-1);
            }}
            onFocus={() => handleFocus("intermediate")}
            onBlur={() => handleBlur("intermediate")}
            onKeyDown={
              focused === "intermediate" ? handleInputKeyDown : undefined
            }
            className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-500 ease-in-out font-medium focus-visible:text-xl pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setShowIntermediate(false);
              setIntermediateInput("");
              setSelectedIntermediate(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!showIntermediate && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setShowIntermediate(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Dodaj przystanek pośredni
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Input
          id="end"
          ref={endInputRef}
          disabled={disabled}
        />
      </div>
      
      <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsDatePickerVisible(!isDatePickerVisible)}
          >
            <Clock className="h-4 w-4 mr-2" />
            {isDatePickerVisible ? "Ukryj datę" : "Wybierz datę"}
          </Button>
      </div>

      {isDatePickerVisible && (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
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
            onSelect={setDate}
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
      <Button
        ref={searchButtonRef}
        variant="outline"
        disabled={disabled || !selectedStart || !selectedEnd}
        className="bg-secondary mt-3 hover:scale-102 hover:cursor-pointer transition-all duration-500 ease-in-out text-md font-bold"
        onClick={() => {
          if (selectedStart && selectedEnd) {
            onSelect(
              selectedStart.group_code,
              selectedEnd.group_code,
              showIntermediate && selectedIntermediate
                ? selectedIntermediate.group_code
                : undefined
            );
          }
        }}
      >
        Wyszukaj
      </Button>

      {/* Suggestions */}
      {suggestions.length > 0 && focused && (
        <Card className="mt-2">
          <CardContent className="p-0">
            <ScrollArea className="h-48 w-full rounded">
              <ul>
                {suggestions.map((item, idx) => (
                  <Item
                    key={item.group_code}
                    className={`px-3 py-2 cursor-pointer rounded ${
                      selectedIndex === idx
                        ? "bg-secondary/70"
                        : "hover:bg-secondary"
                    }`}
                    onMouseDown={() => {
                      setInputValue(item.group_name);
                      setHoveredName("");
                      setSelectedIndex(-1);
                      setFocused(null);
                      if (focused === "start") setSelectedStart(item);
                      if (focused === "end") setSelectedEnd(item);
                      if (focused === "intermediate")
                        setSelectedIntermediate(item);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.group_name}</span>
                    </div>
                  </Item>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
