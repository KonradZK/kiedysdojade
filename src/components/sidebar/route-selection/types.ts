import type { StopGroup } from "@/types/stop";

export type InputType = "start" | "end" | "intermediate";

export interface SelectedStop {
  code: string;
  name: string;
}

export interface StopInputState {
  value: string;
  selected: SelectedStop | null;
  suggestions: StopGroup[];
}

export interface RouteSelectionProps {
  group: StopGroup[];
  onSelect: (start: string, end: string, intermediate?: string) => void;
  disabled?: boolean;
}
