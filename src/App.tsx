import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import Sidebar from "./components/sidebar";
import Map from "./components/map";
import type { Stop } from "./types/stop";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [stops, setStops] = useState<Array<Stop>>([]);
  const [routeStops, setRouteStops] = useState<Array<Stop>>([]);

  // cache
  useEffect(() => {
    const darkMode = localStorage.getItem("theme") === "dark";
    setIsDark(darkMode);
    document.documentElement.classList.toggle("dark", darkMode);

    // Pobieranie i cache'owanie przystanków
    const cachedStops = localStorage.getItem("stops");
    if (cachedStops) {
      setStops(JSON.parse(cachedStops));
    } else {
      fetch("/api/stops")
        .then((res) => res.json())
        .then((data) => {
          setStops(data);
          localStorage.setItem("stops", JSON.stringify(data));
        })
        .catch(() => {
          // obsługa błędu pobierania
        });
    }
  }, []);

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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <Sidebar isDark={isDark} toggleTheme={toggleTheme} stops={stops} onShowRoute={handleShowRoute} />
      <Map stops={routeStops} />
    </div>
  );
}

export default App;
