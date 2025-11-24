import { RouteSelection } from "./route-selection";
import { SidebarHeader } from "./header";

interface SidebarProps {
  isDark: boolean;
  stops: Array<Stop>;
  toggleTheme: (value: boolean) => void;
  onShowRoute: (route: Array<Stop>) => void;
}

import type { Stop } from "@/types/stop";

const Sidebar = ({ isDark, toggleTheme, stops, onShowRoute }: SidebarProps) => {
  const handleRouteSelect = (start: string, end: string) => {
    fetch('/api/path?start_code=' + start + '&end_code=' + end)
      .then(response => response.json())
      .then((data: Array<Stop>) => {
        onShowRoute(data);
        console.log("Dane z API:", data);
      })
      .catch(error => {
        console.error("Błąd podczas fetch:", error);
      });
    console.log("Wybrane przystanki:", start, end);
  };

  return (
    <>
      <aside className="absolute top-4 left-4 z-10 w-80 bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-xl rounded-xl p-6 flex flex-col gap-2 transition-all duration-500 ease-in-out">
        <SidebarHeader isDark={isDark} toggleTheme={toggleTheme} />
        <RouteSelection
          stops={stops}
          onSelect={handleRouteSelect}
        />
      </aside>
    </>
  );
}

export default Sidebar;

