import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import Sidebar from "./components/sidebar";
import Map from "./components/map";
import { Markers } from "./components/map/marker";
import type { StopGroup, Stop } from "./components/sidebar/types";
import { api } from "./services/api";
import { LocalStorageCache } from "./utils/cache";
import { ReportSystem, MapClickListener } from "./components/reportsystem";
import { Alerts } from "./components/map/alerts";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [stops, setStops] = useState<Array<StopGroup>>([]);
  const [routeStops, setRouteStops] = useState<Array<Stop>>([]);
  const [reportCoords, setReportCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setReportCoords({ lat, lng });
    console.log("Saved:", lat, lng);
  };

  const resetReportCoords = () => {
    setReportCoords(null);
  };

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

  const handleShowRoute = (route: Array<Stop>) => {
    setRouteStops(route);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-all duration-300 ease-in-out">
      <Sidebar
        isDark={isDark}
        toggleTheme={toggleTheme}
        stops={stops}
        onShowRoute={handleShowRoute}
        routeStops={routeStops}
      />
      <ReportSystem
        lat={reportCoords?.lat}
        long={reportCoords?.lng}
        onResetLocation={resetReportCoords}
      />

      <Map stops={routeStops}>
        <MapClickListener onLocationSelect={handleMapClick} />
        {reportCoords && <Markers positions={[reportCoords]} isAlert={true} />}
        <Alerts />
      </Map>
    </div>
  );
}

export default App;
