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

export interface Line {
  lineNumber: string;
}

export interface RouteProps {
  id: string;
  status: string;
  timeToGo: string;
  lines: Line[];
  departureTime: string;
  routeTime: number;
  arriveTime: string;
  stops: Stop[];
}

export type Path = PathElement[];

export type TimeTable = TimeTableElement[];
