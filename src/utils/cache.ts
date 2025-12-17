export class LocalStorageCache {
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static set<T>(key: string, data: T): void {
    const item = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  static get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const { data, timestamp } = JSON.parse(item);
      
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        this.remove(key);
        return null;
      }

      return data;
    } catch (e) {
      this.remove(key);
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }

  static has(key: string): boolean {
    return this.get(key) !== null;
  }
}
