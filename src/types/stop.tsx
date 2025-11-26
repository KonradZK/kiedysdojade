interface NewStop {
  stops: Array<Stop>;
  routes: Array<Route>;
  distance: number;
}

interface Stop {
  id: number;
  code: string;
  name: string;
  lat: number;
  lon: number;
  zone_id: string;
}
type Route = {
  lines: Array<string>;
};
export type { Stop, NewStop };
