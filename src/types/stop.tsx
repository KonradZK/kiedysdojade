interface NewStop {
  stops: Array<Stop>;
  routes: Array<Array<string>>;
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
// type Route = {
//   lines: Array<string>;
// };

interface Groupnames {
  group_code: string;
  group_name: string;
}
export type { Stop, NewStop, Groupnames };
