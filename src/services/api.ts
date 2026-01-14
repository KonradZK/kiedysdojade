import type { Alert } from "@/components/reportsystem/types";
import type {
  StopGroup,
  Path,
  TimeTable,
  ShapePoint,
} from "../components/sidebar/types";

export class API {
  private routeInfoCache = new Map<string, any>();

  async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`/api/alerts`);
    if (!response.ok) {
      console.error("Failed to fetch alerts");
      return [];
    }
    const data = await response.json();
    if (data === null) {
      return [];
    }
    // console.log(data);

    return data.map((item: Alert) => ({
      id: item.id,
      lat: item.lat,
      lon: item.lon,
      line: item.line,
      category: item.category,
      score: item.score,
      since: item.since,
      remaning: item.remaning,
    }));
  }

  async createAlert(
    lat: number,
    lng: number,
    type: string,
    line: string | null
  ): Promise<void> {
    const payload = {
      lat: lat,
      lon: lng,
      line: line,
      category: type,
    };
    console.log(payload);

    const response = await fetch(`/api/alerts/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create alert: ${response.statusText}`);
    }
  }

  async voteAlert(id: string, delta: number): Promise<void> {
    const endpoint = delta > 0 ? "up" : "down";
    const response = await fetch(`/api/alerts/${id}/${endpoint}`);

    if (!response.ok) {
      throw new Error(`Failed to vote on alert: ${response.statusText}`);
    }
  }

  async getStopGroups(): Promise<StopGroup[]> {
    const response = await fetch(`/api/stops/groupnames`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stop groups: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch route between two stops
   * @param startCode - Starting stop code
   * @param endCode - Ending stop code
   * @param departureTime - Optional departure time in HH:MM format
   */
  async getAvailablePaths(
    startCode: string,
    endCode: string,
    departureTime?: string
  ): Promise<Path[]> {
    let url = `/api/path?start_code=${startCode}&end_code=${endCode}`;
    if (departureTime) {
      url += `&departure_time=${departureTime}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch route: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch time table for a specific stop
   * @param stopCode - Stop code to fetch times for
   */
  async getTimeTable(stopCode: string): Promise<TimeTable> {
    const response = await fetch(`/api/stop_times/stop?stop=${stopCode}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stop times: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch closest stop group to given coordinates
   * @param lat - Latitude
   * @param lon - Longitude
   */
  async getClosestStop(lat: number, lon: number): Promise<StopGroup> {
    const response = await fetch(`/api/stops/closest?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch closest stop: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch intermediate shape points between two stops on a route
   * @param routeId - Route ID (line number)
   * @param startCode - Starting stop code
   * @param endCode - Ending stop code
   */
  async getShapePoints(
    routeId: string,
    startCode: string,
    endCode: string
  ): Promise<ShapePoint[]> {
    const response = await fetch(
      `/api/shapes/${routeId}/between?start_code=${startCode}&end_code=${endCode}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch shape points: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch route metadata (colors, names) with simple in-memory cache
   */
  async getRouteInfo(routeId: string): Promise<any> {
    if (this.routeInfoCache.has(routeId)) {
      return this.routeInfoCache.get(routeId);
    }
    const response = await fetch(`/api/routes/${routeId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch route info: ${response.statusText}`);
    }
    const data = await response.json();
    this.routeInfoCache.set(routeId, data);
    return data;
  }
  /**
   * Login user
   * Note: Using valid GET with query params as fetch does not support body in GET.
   */
  async login(email: string, password: string): Promise<{ token: string }> {
    const payload = { email, password };
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }
    return response.json();
  }

  async register(email: string, password: string, username: string): Promise<void> {
    const payload = { email, password, username };
    const response = await fetch(`/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        // Try to parse error message if available
        let errorMessage = response.statusText;
        try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (e) {
            // ignore
        }
      throw new Error(`Registration failed: ${errorMessage}`);
    }
  }
}


export const api = new API();
