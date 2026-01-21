import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import Sidebar from "./components/sidebar";
import Map from "./components/map";
import type {
  StopGroup,
  Stop,
  PathElement,
  LineInfo,
} from "./components/sidebar/types";
import { api } from "./services/api";
import { LocalStorageCache } from "./utils/cache";
import { ReportSystem, MapClickListener } from "./components/reportsystem";
import { Alerts } from "./components/map/alerts";
import { PointMarker } from "./components/map/pointmarker";

import { AuthProvider } from "./context/AuthContext";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [stops, setStops] = useState<Array<StopGroup>>([]);
  const [routeStops, setRouteStops] = useState<Array<Stop>>([]);
  const [selectedStart, setSelectedStart] = useState<StopGroup | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<StopGroup | null>(null);
  const [routeLines, setRouteLines] = useState<Array<LineInfo>>([]);
  const [reportCoords, setReportCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [reportStep, setReportStep] = useState<1 | 2 | 3 | 4>(1);
  const [alertsRefreshKey, setAlertsRefreshKey] = useState(0);

  const handleMapClick = (lat: number, lng: number) => {
    setReportCoords({ lat, lng });
  };

  const resetReportCoords = () => {
    setReportCoords(null);
  };

  const handleAlertAdded = () => {
    setAlertsRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const darkMode = localStorage.getItem("theme") === "dark";
    setIsDark(darkMode);
    document.documentElement.classList.toggle("dark", darkMode);

    const cachedStops = LocalStorageCache.get<StopGroup[]>("stops");
    if (cachedStops) {
      setStops(cachedStops);
    } else {
      fetchStops();
    }
  }, []);

  const fetchStops = async () => {
    try {
      const data = await api.getStopGroups();
      setStops(data);
      LocalStorageCache.set("stops", data);
    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  };

  const toggleTheme = (value: boolean) => {
    setIsDark(value);
    document.documentElement.classList.toggle("dark", value);
    localStorage.setItem("theme", value ? "dark" : "light");
  };

  const handleShowRoute = (
    route: Array<Stop>,
    _path: Array<PathElement>,
    lines: Array<LineInfo>
  ) => {
    setRouteStops(route);
    setRouteLines(lines);
  };

  const handleStopSelect = (start: StopGroup | null, end: StopGroup | null) => {
    setSelectedStart(start);
    setSelectedEnd(end);
  };

  return (
    <AuthProvider>
      <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-all duration-300 ease-in-out">
        <Sidebar
          isDark={isDark}
          toggleTheme={toggleTheme}
          stops={stops}
          onShowRoute={handleShowRoute}
          onStopSelect={handleStopSelect}
          routeStops={routeStops}
        />
        <ReportSystem
          lat={reportCoords?.lat}
          long={reportCoords?.lng}
          onResetLocation={resetReportCoords}
          onAlertAdded={handleAlertAdded}
          step={reportStep}
          onStepChange={setReportStep}
        />

        <Map
          stops={routeStops}
          lines={routeLines}
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
        >
          {reportStep === 2 && <MapClickListener onLocationSelect={handleMapClick} />}
          {reportCoords && reportStep >= 2 && (
            <PointMarker position={reportCoords} />
          )}
          <Alerts refreshKey={alertsRefreshKey} />
        </Map>
      </div>
    </AuthProvider>
  );
}

export default App;
