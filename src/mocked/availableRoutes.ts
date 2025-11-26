import type { Stop } from "@/types/stop";

type Line = {
  lineNumber: string;
}

interface RouteProps {
  id: string;
  status: string;
  timeToGo: string;
  lines: Line[];
  departureTime: string;
  routeTime: number;
  arriveTime: string;
  stops: Stop[];
}

const availableRoutes: RouteProps[] = [
  {
    id: "1",
    timeToGo: "2",
    lines: [{ lineNumber: "5" }, { lineNumber: "6" }],
    departureTime: "18:10",
    arriveTime: "18:15",
    routeTime: 5,
    status: "Odjazd za ",
    stops: [
      { code: "SZY", name: "Szymanowskiego", lat: 52.403, lon: 16.928, id: 0, zone_id: "SZY" },
      { code: "KUR", name: "Kurpińskiego", lat: 52.405, lon: 16.930, id: 1, zone_id: "KUR" },
      { code: "PP", name: "Poznań Plaza", lat: 52.407, lon: 16.935, id: 2, zone_id: "PP" },
    ]
  },
  {
    id: "2",
    timeToGo: "10",
    lines: [{ lineNumber: "3" }, { lineNumber: "7" }],
    departureTime: "18:18",
    arriveTime: "18:38",
    routeTime: 20,
    status: "Odjazd za ",
    stops: [
      { code: "AS", name: "Aleje Solidarności", lat: 52.410, lon: 16.940, id: 3, zone_id: "AS" },
      { code: "SŁ", name: "Słowiańska", lat: 52.412, lon: 16.945, id: 4, zone_id: "SŁ" },
      { code: "MT", name: "Most Teatralny", lat: 52.415, lon: 16.950, id: 5, zone_id: "MT" },
    ]
  },
  {
    id: "3",
    timeToGo: "2",
    lines: [{ lineNumber: "5" }, { lineNumber: "6" }],
    departureTime: "18:10",
    arriveTime: "18:15",
    routeTime: 5,
    status: "Odjazd za ",
    stops: [
       { code: "SZY", name: "Szymanowskiego", lat: 52.403, lon: 16.928, id: 0, zone_id: "SZY" },
       { code: "MT", name: "Most Teatralny", lat: 52.415, lon: 16.950, id: 5, zone_id: "MT" },
    ]
  },
];

export { availableRoutes };

export type { RouteProps, Line }

// korekcja na podstawie api /api/path
