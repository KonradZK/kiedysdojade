import type { Path, RouteProps, Stop } from "@/components/sidebar/types";

/**
 * Transform raw route data from API into display-ready RouteProps objects
 * @param routes Array of routes from /path endpoint
 * @param firstStops Array of stops (Stop type) to display
 * @returns Array of RouteProps for sidebar display (max 5 routes)
 */
export function processRoutes(
  paths: Path[],
  firstStops: Stop[]
): RouteProps[] {
  const lines = new Set<string>();
  
  // Collect unique line numbers
  paths.forEach((path) => {
    path.forEach((p) => {
      if (p.line && p.line !== "WALK") lines.add(p.line);
    });
  });

  return paths.slice(0, 5).map((path, idx) => {
    const firstStop = path[0];
    const lastStop = path[path.length - 1];

    const depTime = firstStop.departure_time?.substring(0, 5) || "--:--";
    const arrTime = lastStop.arrival_time?.substring(0, 5) || "--:--";

    // Calculate time to departure
    const now = new Date();
    const [depHour, depMin] = depTime.split(":").map(Number);
    const depDate = new Date();
    depDate.setHours(depHour, depMin, 0);
    
    // Handle next day if departure is before current time late at night
    if (depDate < now && now.getHours() > 20) {
      depDate.setDate(depDate.getDate() + 1);
    }

    const diffMins = Math.max(
      0,
      Math.floor((depDate.getTime() - now.getTime()) / 60000)
    );
    
    const routeTime = Math.floor(
      (new Date(`1970-01-01T${arrTime}`).getTime() -
        new Date(`1970-01-01T${depTime}`).getTime()) /
        60000
    );

    return {
      id: `route-${idx}-${Date.now()}`,
      status: "Odjazd za",
      timeToGo: diffMins.toString(),
      lines: Array.from(lines).map((line) => ({ lineNumber: line })),
      departureTime: depTime,
      arriveTime: arrTime,
      routeTime: routeTime || 20,
      stops: firstStops,
    };
  });
}
