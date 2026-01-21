import { useState, useEffect } from "react";
import type { RouteProps } from "@/components/sidebar/types";

/**
 * Hook that updates route times every second
 * Recalculates time to departure based on current time
 */
export function useRouteTimer(routes: RouteProps[]): RouteProps[] {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return routes.map((route) => {
    const [depHour, depMin] = route.departureTime.split(":").map(Number);
    const depDate = new Date();
    depDate.setHours(depHour, depMin, 0, 0);

    // Handle next day if departure is before current time late at night
    if (depDate < currentTime && currentTime.getHours() > 20) {
      depDate.setDate(depDate.getDate() + 1);
    }

    const diffMs = depDate.getTime() - currentTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    // Determine status and display based on time difference
    let status: string;
    let timeToGo: string;

    if (diffMins < 0) {
      // Departure time has passed
      status = "Odjechał";
      timeToGo = route.departureTime;
    } else if (diffMins >= 100) {
      // More than 100 minutes away
      status = "Odjazd o";
      timeToGo = route.departureTime;
    } else {
      // Less than 100 minutes away
      status = "Odjazd za";
      timeToGo = diffMins.toString();
    }

    return {
      ...route,
      status,
      timeToGo,
    };
  });
}
