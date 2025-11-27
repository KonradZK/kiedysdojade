import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import Sidebar from "./components/sidebar";
import Map from "./components/map";
import type { Groupnames, Stop } from "./types/stop";
import type { StopTimes } from "./types/stop_time";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [stops, setStops] = useState<Array<Groupnames>>([]);
  const [routeStops, setRouteStops] = useState<Array<Stop>>([]);
  const [stopTimes, setStopTimes] = useState<Array<StopTimes>>([]);

  // cache
  useEffect(() => {
    const darkMode = localStorage.getItem("theme") === "dark";
    setIsDark(darkMode);
    document.documentElement.classList.toggle("dark", darkMode);

    // Pobieranie i cache'owanie przystanków
    const cachedStops = localStorage.getItem("stops");
    if (cachedStops) {
      try {
        const parsedStops = JSON.parse(cachedStops);
        // Simple validation to check if the data structure matches Groupnames
        if (Array.isArray(parsedStops) && parsedStops.length > 0 && "group_name" in parsedStops[0]) {
          setStops(parsedStops);
        } else {
          // Invalid cache, fetch fresh data
          fetchStops();
        }
      } catch (e) {
        fetchStops();
      }
    } else {
      fetchStops();
    }

    const cahedTimes = localStorage.getItem("stop_times");
    if (cahedTimes) {
      setStopTimes(JSON.parse(cahedTimes));
    }
  }, []);

  const fetchStops = () => {
    fetch("/api/stops/groupnames")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched stops:", data);
        setStops(data);
        localStorage.setItem("stops", JSON.stringify(data));
      })
      .catch((err) => {
        console.error("Error fetching stops:", err);
      });
  };

  // Zmiana motywu
  const toggleTheme = (value: boolean) => {
    setIsDark(value);
    document.documentElement.classList.toggle("dark", value);
    localStorage.setItem("theme", value ? "dark" : "light");
  };

  // Funkcja do obsługi wyświetlania trasy na mapie
  const handleShowRoute = (route: Array<Stop>) => {
    setRouteStops(route);
  };

  const handleShowTimes = (times: Array<StopTimes>) => {
    setStopTimes(times);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <Sidebar
        isDark={isDark}
        toggleTheme={toggleTheme}
        stops={stops}
        onShowRoute={handleShowRoute}
        onShowTimes={handleShowTimes}
        routeStops={routeStops}
      />
      <Map stops={routeStops} />
    </div>
  );
}

export default App;
