import type { RouteProps } from "@/components/sidebar/route";

const availableRoutes: RouteProps[] = [
  {
    timeToGo: "2",
    lines: [{ lineNumber: "5" }, { lineNumber: "6" }],
    departureTime: "18:10",
    arriveTime: "18:15",
    routeTime: 5,
    status: "Odjazd za ",
  },
  {
    timeToGo: "10",
    lines: [{ lineNumber: "3" }, { lineNumber: "7" }],
    departureTime: "18:18",
    arriveTime: "18:38",
    routeTime: 20,
    status: "Odjazd za ",
  },
];

export { availableRoutes };
