import { useState, useMemo, useRef, useCallback } from "react";
import type { StopGroup } from "@/types/stop";
import type { SelectedStop } from "../types";

interface UseStopInputProps {
  group: StopGroup[];
  disabled?: boolean;
}

interface UseStopInputReturn {
  inputValue: string;
  selected: SelectedStop | null;
  suggestions: StopGroup[];
  selectedIndex: number;
  hoveredName: string;
  isFocused: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  
  setInputValue: (value: string) => void;
  setSelected: (stop: SelectedStop | null) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, onNext?: () => void) => void;
  handleSuggestionClick: (item: StopGroup) => void;
  reset: () => void;
  getDisplayValue: () => string;
}

export function useStopInput({ group, disabled = false }: UseStopInputProps): UseStopInputReturn {
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<SelectedStop | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hoveredName, setHoveredName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (!inputValue) return [];
    return group
      .filter((item) =>
        item.name?.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 8);
  }, [inputValue, group]);

  const handleFocus = useCallback(() => {
    if (disabled) return;
    setIsFocused(true);
    setSelectedIndex(-1);
    setHoveredName("");
  }, [disabled]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const selectedSuggestion = selectedIndex >= 0 ? suggestions[selectedIndex] : suggestions[0];
    if (selectedSuggestion) {
      setInputValue(selectedSuggestion.name);
      setSelected(selectedSuggestion);
    }
    setHoveredName("");
    setSelectedIndex(-1);
  }, [selectedIndex, suggestions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, onNext?: () => void) => {
    if (suggestions.length === 0) return;
    
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => {
        const next = Math.min(prev + 1, suggestions.length - 1);
        setHoveredName(suggestions[next]?.name || "");
        return next;
      });
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => {
        const next = Math.max(prev - 1, 0);
        setHoveredName(suggestions[next]?.name || "");
        return next;
      });
      e.preventDefault();
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      const selectedItem = suggestions[selectedIndex];
      setInputValue(selectedItem.name);
      setHoveredName("");
      setSelectedIndex(-1);
      setIsFocused(false);
      setSelected(selectedItem);
      onNext?.();
    }
  }, [suggestions, selectedIndex]);

  const handleSuggestionClick = useCallback((item: StopGroup) => {
    setInputValue(item.name);
    setHoveredName("");
    setSelectedIndex(-1);
    setIsFocused(false);
    setSelected(item);
  }, []);

  const reset = useCallback(() => {
    setInputValue("");
    setSelected(null);
    setSelectedIndex(-1);
    setHoveredName("");
    setIsFocused(false);
  }, []);

  const getDisplayValue = useCallback(() => {
    return isFocused && hoveredName ? hoveredName : inputValue;
  }, [isFocused, hoveredName, inputValue]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setHoveredName("");
    setSelectedIndex(-1);
  }, []);

  return {
    inputValue,
    selected,
    suggestions,
    selectedIndex,
    hoveredName,
    isFocused,
    inputRef,
    setInputValue: handleInputChange,
    setSelected,
    handleFocus,
    handleBlur,
    handleKeyDown,
    handleSuggestionClick,
    reset,
    getDisplayValue,
  };
}
