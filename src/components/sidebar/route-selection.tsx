import { useState, useMemo, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item } from "@/components/ui/item";
import { NearestStopButton } from "./nearest-stop-button";
import { getSuggestions } from "@/utils/search-suggestions";
import type { StopGroup } from "./types";

interface RouteSelectionProps {
  stops: StopGroup[];
  onSelect: (start: string, end: string, departureTime?: string) => void;
  onStopSelect?: (start: StopGroup | null, end: StopGroup | null) => void;
  disabled?: boolean;
}

export const RouteSelection: React.FC<RouteSelectionProps> = ({
  stops,
  onSelect,
  onStopSelect,
  disabled = false,
}) => {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [focused, setFocused] = useState<"start" | "end" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hoveredName, setHoveredName] = useState<string>("");
  const [selectedStart, setSelectedStart] = useState<StopGroup | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<StopGroup | null>(null);
  const [time, setTime] = useState<string>(format(new Date(), "HH:mm"));
  const [isDefaultTime, setIsDefaultTime] = useState<boolean>(true);

  useEffect(() => {
    if (!isDefaultTime) return;

    const interval = setInterval(() => {
      setTime(format(new Date(), "HH:mm"));
    }, 1000);

    return () => clearInterval(interval);
  }, [isDefaultTime]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    setIsDefaultTime(false);
  };

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const startSuggestions = useMemo(() => {
    return getSuggestions(startInput, stops);
  }, [startInput, stops]);

  const endSuggestions = useMemo(() => {
    return getSuggestions(endInput, stops);
  }, [endInput, stops]);

  const suggestions =
    focused === "start"
      ? startSuggestions
      : endSuggestions;

  const setInputValue =
    focused === "start"
      ? setStartInput
      : setEndInput;

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
        onStopSelect?.(selected, selectedEnd);
        if (endInputRef.current) {
          endInputRef.current.focus();
        }
      } else if (focused === "end") {
        setSelectedEnd(selected);
        onStopSelect?.(selectedStart, selected);
        if (searchButtonRef.current) searchButtonRef.current.focus();
      }
    }
  };

  const handleFocus = (type: "start" | "end") => {
    if (disabled) return;
    setFocused(type);
    setSelectedIndex(-1);
    setHoveredName("");
  };

  const handleBlur = (type: "start" | "end") => {
    setFocused(null);
    if (type === "start") {
      const selected =
        selectedIndex >= 0
          ? startSuggestions[selectedIndex]
          : startSuggestions[0];
      if (selected) {
        setStartInput(selected.group_name);
        setSelectedStart(selected);
        onStopSelect?.(selected, selectedEnd);
      }
    } else if (type === "end") {
      const selected =
        selectedIndex >= 0 ? endSuggestions[selectedIndex] : endSuggestions[0];
      if (selected) {
        setEndInput(selected.group_name);
        setSelectedEnd(selected);
        onStopSelect?.(selectedStart, selected);
      }
    }
    setHoveredName("");
    setSelectedIndex(-1);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Input
            id="start"
            ref={startInputRef}
            disabled={disabled}
            placeholder="Skąd?"
            autoComplete="off"
            value={focused === "start" && hoveredName ? hoveredName : startInput}
            onChange={(e) => {
              setStartInput(e.target.value);
              setHoveredName("");
              setSelectedIndex(-1);
            }}
            onFocus={() => handleFocus("start")}
            onBlur={() => handleBlur("start")}
            onKeyDown={focused === "start" ? handleInputKeyDown : undefined}
            className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-300 ease-in-out font-medium focus-visible:text-xl pr-10"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <NearestStopButton
              onSelect={(stop) => {
                setStartInput(stop.group_name);
                setSelectedStart(stop);
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Input
          id="end"
          ref={endInputRef}
          disabled={disabled}
          placeholder="Dokąd?"
          autoComplete="off"
          value={focused === "end" && hoveredName ? hoveredName : endInput}
          onChange={(e) => {
            setEndInput(e.target.value);
            setHoveredName("");
            setSelectedIndex(-1);
          }}
          onFocus={() => handleFocus("end")}
          onBlur={() => handleBlur("end")}
          onKeyDown={focused === "end" ? handleInputKeyDown : undefined}
          className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-300 ease-in-out font-medium focus-visible:text-xl"
        />
      </div>

      <div className="flex justify-start mt-2">
        <input
          type="time"
          autoComplete="off"
          step="60"
          disabled={disabled}
          className="bg-secondary rounded-lg px-3 py-1 border border-border focus:outline-none focus-visible:outline-none text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          value={time}
          onChange={handleTimeChange}
        />
      </div>
      
      <Button
        ref={searchButtonRef}
        variant="outline"
        disabled={disabled || !selectedStart || !selectedEnd}
        className="bg-secondary mt-3 hover:scale-102 hover:cursor-pointer transition-all duration-300 ease-in-out text-md font-bold"
        onClick={() => {
          if (selectedStart && selectedEnd) {
            onSelect(selectedStart.group_code, selectedEnd.group_code, time);
          }
        }}
      >
        Wyszukaj
      </Button>
      {suggestions.length > 0 && focused ? (
        <Card className="mt-4">
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
      ) : null}
    </>
  );
};
