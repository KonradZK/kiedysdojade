import { RouteSelection } from "./route-selection";
import { SidebarHeader } from "./header";
import RouteDetails from "./route-details";
import { availableRoutes } from "@/mocked/availableRoutes";
import AvailableRoutes from "./available-routes";
import { useState } from "react";
import type { StopTimes } from "@/types/stop_time";

interface SidebarProps {
  isDark: boolean;
  stops: Array<Stop>;
  toggleTheme: (value: boolean) => void;
  onShowRoute: (route: Array<Stop>) => void;
  onShowTimes: (times: Array<StopTimes>) => void;
  routeStops: Array<Stop>;
}

import type { NewStop, Stop } from "@/types/stop";

const Sidebar = ({
  isDark,
  toggleTheme,
  stops,
  onShowRoute,
  onShowTimes,
  routeStops,
}: SidebarProps) => {
  const [isRouteSelected, setIsRouteSelected] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // fetching
  const handleRouteSelect = (start: string, end: string) => {
    fetch("/api" + "/path?start_code=GRP:MT&end_code=GRP:SOB")
      // fetch("/api" + "/path?start_code=" + start + "&end_code=" + end)

      // TODO: na brudno ale trzeba po grupach dodać GRP: i usunąć kody przystanków
      .then((response) => response.json())
      .then((data: NewStop) => {
        // onShowRoute(data.stops);
        setIsRouteSelected(true);
        setSelectedTripId(null); // Reset selection when new route is searched
        console.log("Dane z API:", data);
      })
      .catch((error) => {
        console.error("Błąd podczas fetch:", error);
      });
    console.log("Wybrane przystanki:", start, end);
  };

  const handleStopSelect = (stop_id: string) => {
    setSelectedTripId(stop_id);
    fetch("/api" + "/stop_times/stop=" + stop_id)
      .then((response) => response.json())
      .then((data: Array<StopTimes>) => {
        onShowTimes(data);
        console.log("Godzinowe dane z API: ", data)
      })
      .catch((e) => {
        console.error("Błąd podczas fetch:", e);
      });
  };

  const handleHoverRoute = (stops: Array<Stop>) => {
    onShowRoute(stops);
  };

  return (
    <>
      <aside className="absolute top-4 left-4 z-10 w-80 bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-xl rounded-xl p-6 flex flex-col gap-2 transition-all duration-500 ease-in-out">
        <SidebarHeader isDark={isDark} toggleTheme={toggleTheme} />
        <RouteSelection stops={stops} onSelect={handleRouteSelect} />
      </aside>
      {isRouteSelected && (
        <aside className="absolute top-80 left-4 z-10 w-80 bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-xl rounded-xl flex flex-col gap-2 transition-all duration-500 ease-in-out">
          {!selectedTripId ? (
            <AvailableRoutes
              stops={stops}
              routes={availableRoutes}
              onSelect={handleStopSelect}
              onHoverRoute={handleHoverRoute}
            />
          ) : (
            <RouteDetails routeStops={routeStops} />
          )}
        </aside>
      )}
    </>
  );
};

export default Sidebar;
