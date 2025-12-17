import type { StopGroup, Path, TimeTable } from "../components/sidebar/types";

export class API {
  private baseURL = "https://1732050.xyz/projekt";

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
   */
  async getAvailablePaths(startCode: string, endCode: string): Promise<Path[]> {
    const response = await fetch(
      `${this.baseURL}/path?start_code=${startCode}&end_code=${endCode}`
    );
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
}

export const api = new API();
