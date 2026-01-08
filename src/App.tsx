import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import Sidebar from "./components/sidebar";
import Map from "./components/map";
import type { StopGroup, Stop, PathElement, LineInfo } from "./components/sidebar/types";
import { api } from "./services/api";
import { LocalStorageCache } from "./utils/cache";
import { ReportSystem } from "./components/reportsystem";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [stops, setStops] = useState<Array<StopGroup>>([]);
  const [routeStops, setRouteStops] = useState<Array<Stop>>([]);
  // routePath can be derived when needed from selected route; omitted from state to reduce redundancy
  const [selectedStart, setSelectedStart] = useState<StopGroup | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<StopGroup | null>(null);
  const [routeLines, setRouteLines] = useState<Array<LineInfo>>([]);

  useEffect(() => {
    const darkMode = localStorage.getItem("theme") === "dark";
    setIsDark(darkMode);
    document.documentElement.classList.toggle("dark", darkMode);

    const cachedStops = LocalStorageCache.get<StopGroup[]>("stops");
    if (cachedStops) {
      setStops(cachedStops);
    } else {
      console.log("No cached stops found, fetching...");
      fetchStops();
    }
  }, []);

  const fetchStops = async () => {
    try {
      const data = await api.getStopGroups();
      console.log("Fetched stops:", data);
      setStops(data);
      LocalStorageCache.set("stops", data);
    } catch (err) {
      console.error("Error fetching stops:", err);
    }
  };

  const toggleTheme = (value: boolean) => {
    setIsDark(value);
    document.documentElement.classList.toggle("dark", value);
    localStorage.setItem("theme", value ? "dark" : "light");
  };

  const handleShowRoute = (route: Array<Stop>, _path: Array<PathElement>, lines: Array<LineInfo>) => {
    setRouteStops(route);
    setRouteLines(lines);
  };

  const handleStopSelect = (start: StopGroup | null, end: StopGroup | null) => {
    setSelectedStart(start);
    setSelectedEnd(end);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-all duration-300 ease-in-out">
      <Sidebar
        isDark={isDark}
        toggleTheme={toggleTheme}
        stops={stops}
        onShowRoute={handleShowRoute}
        onStopSelect={handleStopSelect}
        routeStops={routeStops}
      />
      <ReportSystem />
      <Map 
        stops={routeStops} 
        lines={routeLines}
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
      />
    </div>
  );
}

export default App;
