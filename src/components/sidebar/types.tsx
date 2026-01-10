/**
 * Pojedynczy przystanek
 */
export interface Stop {
  id: number;
  code: string;
  name: string;
  lat: number;
  lon: number;
  zone_id: string;
}

/**
 * Grupa przystanków (używane w autocomplete)
 */
export interface StopGroup {
  group_code: string;
  group_name: string;
  lat: number;
  lon: number;
}

/**
 * Pojedynczy przystanek w ramach trasy z informacjami o linii i czasie
 */
export interface PathElement {
  stop: Stop;
  line: string | null;
  departure_time: string | null;
  arrival_time: string | null;
}

/**
 * Punkt pośredni na trasie (dla gładszych polylinii)
 */
export interface ShapePoint {
  id: number;
  lat: number;
  lon: number;
  sequence: number;
}

/**
 * Rozkład jazdy dla przystanku
 */
export interface TimeTableElement {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: number;
  stop_sequence: number;
  stop_headsign: string;
  pickup_type: number;
  drop_off_type: number;
  route_id: string;
}

export interface LineInfo {
  lineNumber: string;
  colorHex?: string;
  textColorHex?: string;
  startCode: string;
  endCode: string;
  shape: ShapePoint[];
}

export interface RouteProps {
  id: string;
  status: string;
  timeToGo: string;
  lines: LineInfo[];
  departureTime: string;
  routeTime: number;
  arriveTime: string;
  path: Path;
}

export type Path = PathElement[];

export type TimeTable = TimeTableElement[];
