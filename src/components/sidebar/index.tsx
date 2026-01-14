import { RouteSelection } from "./route-selection";
import { SidebarHeader } from "./header";
import RouteDetails from "./route-details";
import AvailableRoutes from "./available-routes";
import { LoginForm } from "../login-form";
import { SignupForm } from "../signup-form";
import { useState } from "react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { ArrowLeft, ChevronUp } from "lucide-react";
import { api } from "@/services/api";
import { processRoutes } from "@/utils/route-processing";

import type { Stop, StopGroup, RouteProps, Path, LineInfo } from "./types";

interface SidebarProps {
  isDark: boolean;
  stops: StopGroup[];
  toggleTheme: (value: boolean) => void;
  onShowRoute: (route: Stop[], path: Path, lines: LineInfo[]) => void;
  onStopSelect?: (start: StopGroup | null, end: StopGroup | null) => void;
  routeStops: Stop[];
}

const Sidebar = ({
  isDark,
  toggleTheme,
  stops,
  onShowRoute,
  onStopSelect,
  routeStops,
}: SidebarProps) => {
  const [isRouteSelected, setIsRouteSelected] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [fetchedRoutes, setFetchedRoutes] = useState<RouteProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  // Fetch and process available routes from API
  const handleRouteSelect = async (
    start: string,
    end: string,
    departureTime?: string
  ) => {
    setIsLoading(true);
    try {
      const paths: Path[] = await api.getAvailablePaths(start, end, departureTime);
      console.log("Fetched paths:", paths);
      setIsRouteSelected(true);
      setSelectedTripId(null);

      // Remove first and last stops (artificial group stops) from each path
      const cleanedPaths = paths.map((path) => {
        return path.slice(1, -1);
      });

      // Process routes using utility - each path becomes a separate route with line segments
      const baseRoutes = processRoutes(cleanedPaths);

      // Assign fixed palette colors and fetch shapes per line segment
      const PALETTE = ["#22c55e", "#3b82f6", "#ef4444", "#8b5cf6", "#f59e0b"]; // green, blue, red, purple, yellow
      const routesWithShapes: RouteProps[] = await Promise.all(
        baseRoutes.map(async (route) => {
          const enrichedLines: LineInfo[] = await Promise.all(
            route.lines.map(async (line, idx) => {
              // WALK segments: render dotted white, no API call
              if (line.lineNumber === "WALK") {
                return {
                  ...line,
                  colorHex: "#ffffff",
                  textColorHex: "#0f172a", // ensure visible label in list
                  shape: [], // Map will draw straight line between start/end
                };
              }
              try {
                const shape = await api.getShapePoints(
                  line.lineNumber,
                  line.startCode,
                  line.endCode
                );
                return {
                  ...line,
                  colorHex: PALETTE[idx % PALETTE.length],
                  textColorHex: undefined,
                  shape,
                };
              } catch (e) {
                console.error("Error fetching shape for line", line.lineNumber, e);
                return {
                  ...line,
                  colorHex: PALETTE[idx % PALETTE.length],
                  textColorHex: undefined,
                  shape: [],
                };
              }
            })
          );

          return { ...route, lines: enrichedLines };
        })
      );

      setFetchedRoutes(routesWithShapes);

      // Use first route for map display
      if (routesWithShapes.length > 0) {
        const firstRoute = routesWithShapes[0];
        const firstStops = firstRoute.path.map((rs) => rs.stop);
        onShowRoute(firstStops, firstRoute.path, firstRoute.lines);
      }
    } catch (err) {
      console.error("Error fetching routes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSelect = async (stop_code: string) => {
    setSelectedTripId(stop_code);
    
    // If it's a route ID (from search results), show this route on map
    if (stop_code.startsWith("route-")) {
      const selectedRoute = fetchedRoutes.find((route) => route.id === stop_code);
      if (selectedRoute) {
        const stops = selectedRoute.path.map((e) => e.stop);
        onShowRoute(stops, selectedRoute.path, selectedRoute.lines);
      }
      return;
    }

    // Fetch stop times for this stop
    try {
      const data = await api.getTimeTable(stop_code);
      console.log("Stop times:", data);
    } catch (e) {
      console.error("Error fetching stop times:", e);
    }
  };

  const handleHoverRoute = (route: RouteProps | null) => {
    if (!route) {
      onShowRoute([], [], []);
      return;
    }
    const stops = route.path.map((e) => e.stop);
    onShowRoute(stops, route.path, route.lines);
  };

  const handleBack = () => {
    if (selectedTripId) {
      setSelectedTripId(null);
    } else if (isRouteSelected) {
      setIsRouteSelected(false);
      onShowRoute([], [], []);
      setFetchedRoutes([]);
    }
  };

  const selectedRoute = fetchedRoutes.find(
    (route) => route.id === selectedTripId
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex absolute top-4 left-4 z-10 w-80 bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-xl rounded-xl p-6 flex-col gap-2 transition-all duration-300 ease-in-out max-h-[90vh] overflow-hidden">
        <SidebarHeader
          isDark={isDark}
          toggleTheme={toggleTheme}
          authMode={authMode}
          onAuthModeChange={setAuthMode}
        />

        {authMode === "login" && (
          <LoginForm onSwitchToSignup={() => setAuthMode("signup")} />
        )}
        {authMode === "signup" && (
          <SignupForm onSwitchToLogin={() => setAuthMode("login")} />
        )}

        {!authMode && (
          <>
            <RouteSelection
              stops={stops}
              onSelect={handleRouteSelect}
              onStopSelect={onStopSelect}
              disabled={isRouteSelected}
            />

            {isRouteSelected && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-8 w-8 shrink-0"
                >
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
                    routes={fetchedRoutes}
                    onSelect={handleStopSelect}
                    onHoverRoute={handleHoverRoute}
                    isLoading={isLoading}
                  />
                ) : (
                  <RouteDetails
                    routeStops={routeStops}
                    route={selectedRoute}
                  />
                )}
              </div>
            )}
          </>
        )}
      </aside>

      {/* Mobile Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 md:hidden rounded-full h-14 w-14 bg-secondary hover:bg-primary/90 shadow-lg"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-sidebar text-sidebar-foreground border-sidebar-border">
          <div className="mx-auto w-full max-w-sm flex flex-col gap-4 p-6 h-[80vh] overflow-y-auto">
            <SidebarHeader
              isDark={isDark}
              toggleTheme={toggleTheme}
              authMode={authMode}
              onAuthModeChange={setAuthMode}
            />

            {authMode === "login" && (
              <LoginForm onSwitchToSignup={() => setAuthMode("signup")} />
            )}
            {authMode === "signup" && (
              <SignupForm onSwitchToLogin={() => setAuthMode("login")} />
            )}

            {!authMode && (
              <>
                <RouteSelection
                  stops={stops}
                  onSelect={(start, end) => {
                    handleRouteSelect(start, end);
                    setIsDrawerOpen(false);
                  }}
                  onStopSelect={onStopSelect}
                  disabled={isRouteSelected}
                />

                {isRouteSelected && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBack}
                      className="h-8 w-8 shrink-0"
                    >
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
                        routes={fetchedRoutes}
                        onSelect={handleStopSelect}
                        onHoverRoute={handleHoverRoute}
                        isLoading={isLoading}
                      />
                    ) : (
                      <RouteDetails
                        routeStops={routeStops}
                        route={selectedRoute}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
