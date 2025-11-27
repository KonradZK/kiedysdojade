import { useState, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item } from "@/components/ui/item";
import type { Groupnames } from "@/types/stop";

interface RouteSelectionProps {
  group: Array<Groupnames>;
  onSelect: (start: string, end: string) => void;
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
  const [focused, setFocused] = useState<"start" | "end" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hoveredName, setHoveredName] = useState<string>("");
  const [selectedStart, setSelectedStart] = useState<{
      group_code: string;
      group_name: string;
    // code: string;
    // name: string;
  } | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<{
    group_code: string;
    group_name: string;
    // code: string;
    // name: string;
  } | null>(null);

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
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

  const suggestions = focused === "start" ? startSuggestions : endSuggestions;
  const setInputValue = focused === "start" ? setStartInput : setEndInput;

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
        if (endInputRef.current) endInputRef.current.focus();
      } else if (focused === "end") {
        setSelectedEnd(selected);
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
      }
    } else {
      const selected =
        selectedIndex >= 0 ? endSuggestions[selectedIndex] : endSuggestions[0];
      if (selected) {
        setEndInput(selected.group_name);
        setSelectedEnd(selected);
      }
    }
    setHoveredName("");
    setSelectedIndex(-1);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Input
          id="start"
          ref={startInputRef}
          disabled={disabled}
          placeholder="Skąd?"
          value={focused === "start" && hoveredName ? hoveredName : startInput}
          onChange={(e) => {
            setStartInput(e.target.value);
            setHoveredName("");
            setSelectedIndex(-1);
          }}
          onFocus={() => handleFocus("start")}
          onBlur={() => handleBlur("start")}
          onKeyDown={focused === "start" ? handleInputKeyDown : undefined}
          className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-500 ease-in-out font-medium focus-visible:text-xl"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Input
          id="end"
          ref={endInputRef}
          disabled={disabled}
          placeholder="Dokąd?"
          value={focused === "end" && hoveredName ? hoveredName : endInput}
          onChange={(e) => {
            setEndInput(e.target.value);
            setHoveredName("");
            setSelectedIndex(-1);
          }}
          onFocus={() => handleFocus("end")}
          onBlur={() => handleBlur("end")}
          onKeyDown={focused === "end" ? handleInputKeyDown : undefined}
          className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-500 ease-in-out font-medium focus-visible:text-xl"
        />
      </div>
      <Button
        ref={searchButtonRef}
        variant="outline"
        disabled={disabled || !selectedStart || !selectedEnd}
        className="bg-secondary mt-3 hover:scale-102 hover:cursor-pointer transition-all duration-500 ease-in-out text-md font-bold"
        onClick={() => {
          if (selectedStart && selectedEnd) {
            onSelect(selectedStart.group_code, selectedEnd.group_code);
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
