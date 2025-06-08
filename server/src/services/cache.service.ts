import { LRUCache } from "lru-cache";
import AppConfig from "../config/index";

/**
 * Cache options
 */
interface CacheOptions {
  max: number;
  ttl: number;
}

/**
 * Cache configuration
 */
const options: CacheOptions = {
  max: AppConfig.CACHE_MAX_ITEMS || 100,
  ttl: AppConfig.CACHE_MAX_AGE_MS || 1000 * 60 * 5, // 5 minutes
};

/**
 * Product cache instance
 * Uses LRU (Least Recently Used) strategy for cache eviction
 */
export const productCache = new LRUCache<string, object>(options);