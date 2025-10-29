import crypto from 'crypto-js';

interface CachedRoadmap {
  data: any;
  timestamp: number;
  key: string;
}

class RoadmapCache {
  private readonly CACHE_PREFIX = 'roadmap_cache_';
  private readonly CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  // Generate hash key from roadmap parameters
  generateCacheKey(technology: string, duration: string, difficulty: string): string {
    const combinedString = `${technology}-${duration}-${difficulty}`.toLowerCase();
    return crypto.SHA256(combinedString).toString();
  }

  // Get cached roadmap if exists and not expired
  getCachedRoadmap(technology: string, duration: string, difficulty: string): any | null {
    const cacheKey = this.generateCacheKey(technology, duration, difficulty);
    const storageKey = `${this.CACHE_PREFIX}${cacheKey}`;

    try {
      const cachedItem = localStorage.getItem(storageKey);
      
      if (!cachedItem) {
        console.log('Cache miss: No cached roadmap found');
        return null;
      }

      const parsed: CachedRoadmap = JSON.parse(cachedItem);
      const now = Date.now();
      const age = now - parsed.timestamp;

      // Check if cache is expired
      if (age > this.CACHE_DURATION) {
        console.log('Cache expired: Removing old roadmap');
        this.removeCachedRoadmap(technology, duration, difficulty);
        return null;
      }

      const daysOld = Math.floor(age / (24 * 60 * 60 * 1000));
      console.log(`Cache hit: Roadmap found (${daysOld} days old)`);
      
      return parsed.data;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  // Save roadmap to cache
  setCachedRoadmap(technology: string, duration: string, difficulty: string, roadmapData: any): void {
    const cacheKey = this.generateCacheKey(technology, duration, difficulty);
    const storageKey = `${this.CACHE_PREFIX}${cacheKey}`;

    const cacheItem: CachedRoadmap = {
      data: roadmapData,
      timestamp: Date.now(),
      key: cacheKey,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(cacheItem));
      console.log('Roadmap cached successfully');
    } catch (error) {
      console.error('Cache write error:', error);
      // Handle quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded, clearing old caches');
        this.clearExpiredCaches();
      }
    }
  }

  // Remove specific cached roadmap
  removeCachedRoadmap(technology: string, duration: string, difficulty: string): void {
    const cacheKey = this.generateCacheKey(technology, duration, difficulty);
    const storageKey = `${this.CACHE_PREFIX}${cacheKey}`;
    localStorage.removeItem(storageKey);
  }

  // Clear all expired caches
  clearExpiredCaches(): void {
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        try {
          const cachedItem = localStorage.getItem(key);
          if (cachedItem) {
            const parsed: CachedRoadmap = JSON.parse(cachedItem);
            const age = now - parsed.timestamp;

            if (age > this.CACHE_DURATION) {
              keysToRemove.push(key);
            }
          }
        } catch (error) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`Cleared ${keysToRemove.length} expired cache entries`);
  }

  // Get all cached roadmaps (for debugging/management)
  getAllCachedRoadmaps(): CachedRoadmap[] {
    const caches: CachedRoadmap[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        try {
          const cachedItem = localStorage.getItem(key);
          if (cachedItem) {
            caches.push(JSON.parse(cachedItem));
          }
        } catch (error) {
          console.error('Error reading cache:', error);
        }
      }
    }

    return caches;
  }

  // Clear all roadmap caches
  clearAllCaches(): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`Cleared all ${keysToRemove.length} cache entries`);
  }
}

export const roadmapCache = new RoadmapCache();