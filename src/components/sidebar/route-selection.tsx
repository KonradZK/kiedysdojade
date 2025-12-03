
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item } from "@/components/ui/item";
import type { Stop } from "@/types/stop";

interface RouteSelectionProps {
  stops: Stop[];
  onSelect: (start: string, end: string, intermediates: string[]) => void;
  disabled?: boolean;
}

export const RouteSelection: React.FC<RouteSelectionProps> = ({
  stops,
  onSelect,
  disabled = false,
}) => {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [intermediates, setIntermediates] = useState<string[]>([]);
  const [focused, setFocused] = useState<"start" | "end" | "intermediate" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [activeIntermediate, setActiveIntermediate] = useState<number | null>(null);

  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLButtonElement>(null);
  const addIntermediateRef = useRef<HTMLButtonElement>(null);

  const filteredStops = (input: string) =>
    stops.filter((s) => s.name.toLowerCase().includes(input.toLowerCase())).slice(0, 8);

  const suggestions =
    focused === "start"
      ? filteredStops(startInput)
      : focused === "end"
      ? filteredStops(endInput)
      : focused === "intermediate" && activeIntermediate !== null
      ? filteredStops(intermediates[activeIntermediate] || "")
      : [];

  const setInputValue = (type: "start" | "end" | "intermediate", value: string, idx?: number) => {
    if (type === "start") setStartInput(value);
    else if (type === "end") setEndInput(value);
    else if (type === "intermediate" && idx !== undefined) {
      const copy = [...intermediates];
      copy[idx] = value;
      setIntermediates(copy);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "start" | "end" | "intermediate",
    idx?: number
  ) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        e.preventDefault();
        return;
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        e.preventDefault();
        return;
      } else if (e.key === "Enter") {
        const selected = suggestions[selectedIndex] || suggestions[0];
        if (selected) {
          setInputValue(type, selected.name, idx);
        }

        setFocused(null);
        setSelectedIndex(-1);

        // Focus następnego pola — BEZ klikania "Dodaj przystanek"
        if (type === "start" && endRef.current) {
          endRef.current.focus();
        } else if (type === "end" && searchRef.current) {
          searchRef.current.focus();
        } else if (type === "intermediate") {
          if (idx !== undefined) {
            if (idx < intermediates.length - 1) {
              setFocused("intermediate");
              setActiveIntermediate(idx + 1);
              setSelectedIndex(0);
            } else {
              // Ostatni przystanek — koniec :)
              setFocused(null);
            }
          }
        }

        e.preventDefault();
        return;
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
          onBlur={() => setFocused(null)}
          onKeyDown={(e) => handleKeyDown(e, "intermediate", idx)}
          disabled={disabled}
        />
      ))}

      <Button ref={addIntermediateRef} variant="ghost" onClick={addIntermediate}>
        Dodaj przystanek pośredni
      </Button>

      {/* Wyszukaj */}
      <Button
        ref={searchRef}
        onClick={() => onSelect(startInput, endInput, intermediates.filter(Boolean))}
        disabled={!startInput || !endInput}
      >
        Wyszukaj
      </Button>

      {/* Suggestions */}
      {suggestions.length > 0 && focused && (
        <Card className="mt-2">
          <CardContent className="p-0">
            <ScrollArea className="h-48 w-full rounded">
              <ul>
                {suggestions.map((stop, idx) => (
                  <Item
                    key={stop.code}
                    onMouseDown={() => {
                      setInputValue(
                        focused!,
                        stop.name,
                        focused === "intermediate" ? activeIntermediate! : undefined
                      );
                      setFocused(null);
                      setSelectedIndex(-1);

                      if (focused === "start" && endRef.current) endRef.current.focus();
                      else if (focused === "end" && searchRef.current) searchRef.current.focus();
                      else if (focused === "intermediate") {
                        if (
                          activeIntermediate !== null &&
                          activeIntermediate < intermediates.length - 1
                        ) {
                          setFocused("intermediate");
                          setActiveIntermediate(activeIntermediate + 1);
                        }
                      }
                    }}
                  >
                    {stop.name}
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
