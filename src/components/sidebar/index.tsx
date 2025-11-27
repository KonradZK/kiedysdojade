import { RouteSelection } from "./route-selection";
import { SidebarHeader } from "./header";
import RouteDetails from "./route-details";
import AvailableRoutes from "./available-routes";
import { useState } from "react";
import type { StopTimes } from "@/types/stop_time";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface SidebarProps {
  isDark: boolean;
  stops: Array<Groupnames>;
  toggleTheme: (value: boolean) => void;
  onShowRoute: (route: Array<Stop>) => void;
  onShowTimes: (times: Array<StopTimes>) => void;
  routeStops: Array<Stop>;
}

import type { Groupnames, NewStop, Stop } from "@/types/stop";

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
  const [fetchedRoutes, setFetchedRoutes] = useState<import("@/mocked/availableRoutes").RouteProps[]>([]);

  // fetching
  const handleRouteSelect = (start: string, end: string) => {
      fetch("/api" + "/path?start_code=" + start + "&end_code=" + end)
      .then((response) => response.json())
      .then((data: NewStop) => {
        // onShowRoute(data.stops);
        setIsRouteSelected(true);
        setSelectedTripId(null); // Reset selection when new route is searched
        console.log("Dane z API:", data);

        // Fetch stop times for the first stop to calculate real-time departure
        if (data.stops.length > 0) {
          const firstStopCode = data.stops[0].code;
          fetch(`/api/stop_times/stop?stop_code=${firstStopCode}`)
            .then((res) => res.json())
            .then((times: StopTimes[]) => {
              console.log("Stop times:", times);
              
              // Limit to first 100 items to ensure we find enough departures
              const limitedTimes = times.slice(0, 100);

              // Get allowed lines from the path
              // data.routes is string[][] so flat() gives string[]
              const allowedLines = new Set(data.routes.flat());
              console.log("Allowed lines:", Array.from(allowedLines));
              
              // Find the next departure for allowed lines
              const now = new Date();
              const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
              console.log("Current time:", currentTime);
              // Filter and sort relevant departures using limited times
              const relevantDepartures = limitedTimes
                .filter(t => allowedLines.has(t.route_id))
                .filter(t => t.departure_time >= currentTime)
                .sort((a, b) => a.departure_time.localeCompare(b.departure_time));
              
              console.log("Relevant departures:", relevantDepartures);

                 // De-duplicate departures (same route_id and departure_time)
                 const uniqueDepartures = relevantDepartures.filter((departure, index, self) =>
                    index === self.findIndex((t) => (
                      t.route_id === departure.route_id && t.departure_time === departure.departure_time
                    ))
                 );

                 // Take top 5 departures
                 const nextDepartures = uniqueDepartures.slice(0, 5);
                 
                 const newRoutes: import("@/mocked/availableRoutes").RouteProps[] = nextDepartures.map((departure, index) => {
                    const departureTime = departure.departure_time.substring(0, 5);
                    
                    // Calculate minutes to go
                    const [depHour, depMin] = departureTime.split(':').map(Number);
                    const depDate = new Date();
                    depDate.setHours(depHour, depMin, 0, 0);
                    
                    // Handle case where departure is next day (basic check)
                    if (depDate < now && (now.getHours() > 20 && depHour < 4)) {
                        depDate.setDate(depDate.getDate() + 1);
                    }
   
                    const diffMs = depDate.getTime() - now.getTime();
                    const diffMins = Math.max(0, Math.floor(diffMs / 60000));
                    const timeToGo = diffMins.toString();
   
                    // Calculate arrival time based on route duration (mocked/estimated from distance)
                    const durationMins = Math.round(data.distance / 333) + 2; // +2 buffer
                    const arrDate = new Date(depDate.getTime() + durationMins * 60000);
                    const arriveTime = arrDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
   
                    return {
                       id: `api-route-${index}-${Date.now()}`,
                       status: "Odjazd za",
                       timeToGo: timeToGo,
                       lines: [{ lineNumber: departure.route_id }],
                       departureTime: departureTime,
                       arriveTime: arriveTime,
                       routeTime: durationMins,
                       stops: data.stops,
                    };
                 });

              setFetchedRoutes(newRoutes);
              onShowRoute(data.stops);

            })
            .catch(err => console.error("Error fetching stop times:", err));
        }
      })
      .catch((error) => {
        console.error("Błąd podczas fetch:", error);
      });
    console.log("Wybrane przystanki:", start, end);
  };

  const handleStopSelect = (stop_code: string) => {
    setSelectedTripId(stop_code);
    
    // If it's a route ID (from search results), don't fetch stop times
    if (stop_code.startsWith("api-route-")) {
      return;
    }

    fetch("/api" + "/stop_times/stop=" + stop_code)
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

  const handleBack = () => {
    if (selectedTripId) {
      setSelectedTripId(null);
    } else if (isRouteSelected) {
      setIsRouteSelected(false);
      onShowRoute([]);
      setFetchedRoutes([]); // Clear routes on back
    }
  };

  const selectedRoute = fetchedRoutes.find(
    (route) => route.id === selectedTripId
  );

  return (
    <aside className="absolute top-4 left-4 z-10 w-80 bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-xl rounded-xl p-6 flex flex-col gap-2 transition-all duration-500 ease-in-out max-h-[90vh] overflow-hidden">
      <SidebarHeader isDark={isDark} toggleTheme={toggleTheme} />
      <RouteSelection
        group={stops}
        onSelect={handleRouteSelect}
        disabled={isRouteSelected}
      />
      
      {isRouteSelected && (
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {selectedTripId ? "Wróć do wyników" : "Wróć do wyszukiwania"}
          </span>
        </div>
      )}

      {isRouteSelected && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {!selectedTripId ? (
            <AvailableRoutes
              stops={stops}
              routes={fetchedRoutes}
              onSelect={handleStopSelect}
              onHoverRoute={handleHoverRoute}
            />
          ) : (
            <RouteDetails
              routeStops={routeStops}
              route={selectedRoute}
            />
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
