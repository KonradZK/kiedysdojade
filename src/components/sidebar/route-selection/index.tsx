import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStopInput } from "./hooks/use-stop-input";
import { StopInput } from "./components/stop-input";
import { SuggestionsList } from "./components/suggestions-list";
import { DateTimePicker } from "./components/date-time-picker";
import type { RouteSelectionProps, InputType } from "./types";

export function RouteSelection({
  group,
  onSelect,
  disabled = false,
}: RouteSelectionProps) {
  const [showIntermediate, setShowIntermediate] = useState(false);
  const [focusedInput, setFocusedInput] = useState<InputType | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const startInput = useStopInput({ group, disabled });
  const intermediateInput = useStopInput({ group, disabled });
  const endInput = useStopInput({ group, disabled });

  const activeSuggestions =
    focusedInput === "start"
      ? startInput.suggestions
      : focusedInput === "end"
      ? endInput.suggestions
      : focusedInput === "intermediate"
      ? intermediateInput.suggestions
      : [];

  const activeSelectedIndex =
    focusedInput === "start"
      ? startInput.selectedIndex
      : focusedInput === "end"
      ? endInput.selectedIndex
      : focusedInput === "intermediate"
      ? intermediateInput.selectedIndex
      : -1;

  const handleSuggestionSelect = (item: typeof group[0]) => {
    if (focusedInput === "start") {
      startInput.handleSuggestionClick(item);
    } else if (focusedInput === "end") {
      endInput.handleSuggestionClick(item);
    } else if (focusedInput === "intermediate") {
      intermediateInput.handleSuggestionClick(item);
    }
    setFocusedInput(null);
  };

  const handleStartFocus = () => {
    startInput.handleFocus();
    setFocusedInput("start");
  };

  const handleStartBlur = () => {
    startInput.handleBlur();
    setFocusedInput(null);
  };

  const handleIntermediateFocus = () => {
    intermediateInput.handleFocus();
    setFocusedInput("intermediate");
  };

  const handleIntermediateBlur = () => {
    intermediateInput.handleBlur();
    setFocusedInput(null);
  };

  const handleEndFocus = () => {
    endInput.handleFocus();
    setFocusedInput("end");
  };

  const handleEndBlur = () => {
    endInput.handleBlur();
    setFocusedInput(null);
  };

  const handleRemoveIntermediate = () => {
    setShowIntermediate(false);
    intermediateInput.reset();
  };

  const handleSearch = () => {
    if (startInput.selected && endInput.selected) {
      onSelect(
        startInput.selected.code,
        endInput.selected.code,
        showIntermediate && intermediateInput.selected
          ? intermediateInput.selected.code
          : undefined
      );
    }
  };

  return (
    <>
      <StopInput
        id="start"
        ref={startInput.inputRef}
        placeholder="Skąd?"
        value={startInput.getDisplayValue()}
        disabled={disabled}
        onChange={startInput.setInputValue}
        onFocus={handleStartFocus}
        onBlur={handleStartBlur}
        onKeyDown={(e) =>
          startInput.handleKeyDown(e, () => {
            if (showIntermediate) {
              intermediateInput.inputRef.current?.focus();
            } else {
              endInput.inputRef.current?.focus();
            }
          })
        }
      />

      {showIntermediate && (
        <StopInput
          id="intermediate"
          ref={intermediateInput.inputRef}
          placeholder="Przez?"
          value={intermediateInput.getDisplayValue()}
          disabled={disabled}
          showRemoveButton
          onChange={intermediateInput.setInputValue}
          onFocus={handleIntermediateFocus}
          onBlur={handleIntermediateBlur}
          onKeyDown={(e) =>
            intermediateInput.handleKeyDown(e, () => {
              endInput.inputRef.current?.focus();
            })
          }
          onRemove={handleRemoveIntermediate}
        />
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

      <StopInput
        id="end"
        ref={endInput.inputRef}
        placeholder="Dokąd?"
        value={endInput.getDisplayValue()}
        disabled={disabled}
        onChange={endInput.setInputValue}
        onFocus={handleEndFocus}
        onBlur={handleEndBlur}
        onKeyDown={(e) =>
          endInput.handleKeyDown(e, () => {
            searchButtonRef.current?.focus();
          })
        }
      />

      <DateTimePicker date={date} onDateChange={setDate} />

      <Button
        ref={searchButtonRef}
        variant="outline"
        disabled={disabled || !startInput.selected || !endInput.selected}
        className="bg-secondary mt-3 hover:scale-102 hover:cursor-pointer transition-all duration-500 ease-in-out text-md font-bold"
        onClick={handleSearch}
      >
        Wyszukaj
      </Button>

      {activeSuggestions.length > 0 && focusedInput && (
        <SuggestionsList
          suggestions={activeSuggestions}
          selectedIndex={activeSelectedIndex}
          onSelect={handleSuggestionSelect}
        />
      )}
    </>
  );
}

// Re-export types for convenience
export type { RouteSelectionProps } from "./types";
