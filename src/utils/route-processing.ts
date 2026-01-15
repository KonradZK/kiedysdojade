import type { Path, RouteProps, LineInfo } from "@/components/sidebar/types";

/**
 * Transform raw route data from API into display-ready RouteProps objects
 * Each path becomes a separate route entry based on contiguous line segments
 * @param paths Array of paths from /path endpoint (typically cleaned via slice(1, -1))
 * @returns Array of RouteProps for sidebar display
 */
export function processRoutes(
  paths: Path[]
): RouteProps[] {
  const routes: RouteProps[] = [];

  paths.forEach((path, pathIdx) => {
    if (path.length < 2) return;

    // Build segments: for each contiguous block of the same `line`,
    // create a segment from the PREVIOUS element (start) to the LAST element of the block (end).
    // Index 0 is typically a GROUP_NODE; we start scanning from index 1.
    const segments: LineInfo[] = [];
    let currentLine: string | null = null;
    let blockStartIdx = 1; // first real element after initial group node

    const pushSegment = (endIdx: number) => {
      if (!currentLine || currentLine === "GROUP_NODE") return; // ignore pure group nodes
      const startIdx = blockStartIdx - 1; // previous element is the segment start
      const startCode = path[startIdx]?.stop.code;
      const endCode = path[endIdx]?.stop.code;
      if (!startCode || !endCode) return;
      segments.push({
        lineNumber: currentLine,
        colorHex: undefined,
        textColorHex: undefined,
        startCode,
        endCode,
        shape: [],
      });
    };

    // Initialize current line from index 1 if available
    currentLine = path[1]?.line ?? null;
    blockStartIdx = 1;

    for (let i = 2; i < path.length; i++) {
      const ln = path[i].line;
      if (ln !== currentLine) {
        // finalize previous block
        if (currentLine !== null) {
          pushSegment(i - 1);
        }
        // start new block
        currentLine = ln;
        blockStartIdx = i;
      }
    }
    // finalize last block
    pushSegment(path.length - 1);

    if (segments.length === 0) return;

    // First and last stop times
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

    routes.push({
      id: `route-${pathIdx}-${Date.now()}`,
      status: diffMins >= 100 ? "Odjazd o" : "Odjazd za",
      timeToGo: diffMins >= 100 ? depTime : diffMins.toString(),
      lines: segments,
      departureTime: depTime,
      arriveTime: arrTime,
      routeTime: routeTime || 20,
      path: path,
    });
  });

  return routes;
}
