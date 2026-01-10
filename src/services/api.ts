import type { Alert } from "@/components/reportsystem/types";
import type { StopGroup, Path, TimeTable } from "../components/sidebar/types";

export class API {
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
    console.log(data);

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

  async createAlert(lat: number, lng: number, type: string): Promise<void> {
    const payload = {
      lat: lat,
      lon: lng,
      line: "3", // Default to 0 as we don't have line selection yet
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
   */
  async getAvailablePaths(startCode: string, endCode: string): Promise<Path[]> {
    const response = await fetch(
      `/api/path?start_code=${startCode}&end_code=${endCode}`
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
}

export const api = new API();
