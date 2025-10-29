import crypto from 'crypto';

interface CachedRoadmap {
  data: any;
  timestamp: number;
}

class RoadmapCacheService {
  private cache: Map<string, CachedRoadmap> = new Map();
  private readonly CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  generateCacheKey(technology: string, duration: string, difficulty: string): string {
    const combinedString = `${technology}-${duration}-${difficulty}`.toLowerCase();
    return crypto.createHash('sha256').update(combinedString).digest('hex');
  }

  get(technology: string, duration: string, difficulty: string): any | null {
    const key = this.generateCacheKey(technology, duration, difficulty);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    console.log(`Backend cache hit for: ${technology}-${duration}-${difficulty}`);
    return cached.data;
  }

  set(technology: string, duration: string, difficulty: string, data: any): void {
    const key = this.generateCacheKey(technology, duration, difficulty);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    console.log(`Cached roadmap: ${technology}-${duration}-${difficulty}`);
  }

  clear(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  clearExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((value, key) => {
      if (now - value.timestamp > this.CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`Cleared ${keysToDelete.length} expired cache entries`);
  }
}

export const roadmapCacheService = new RoadmapCacheService();