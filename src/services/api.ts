import type { StopGroup, Path, TimeTable, ShapePoint } from "../components/sidebar/types";

export class API {
  private baseURL = "https://1732050.xyz/projekt";
  private routeInfoCache = new Map<string, any>();

  async getStopGroups(): Promise<StopGroup[]> {
    const response = await fetch(`${this.baseURL}/stops/groupnames`);
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
    let url = `${this.baseURL}/path?start_code=${startCode}&end_code=${endCode}`;
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
    const response = await fetch(
      `${this.baseURL}/stop_times/stop?stop=${stopCode}`
    );
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
    const response = await fetch(
      `${this.baseURL}/stops/closest?lat=${lat}&lon=${lon}`
    );
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
      `${this.baseURL}/shapes/${routeId}/between?start_code=${startCode}&end_code=${endCode}`
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
    const response = await fetch(`${this.baseURL}/routes/${routeId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch route info: ${response.statusText}`);
    }
    const data = await response.json();
    this.routeInfoCache.set(routeId, data);
    return data;
  }
}

export const api = new API();
