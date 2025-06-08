import { LRUCache } from "lru-cache";
import { Product, PaginatedProductsResponse, ApiError, AppConfigType } from "@shared/types";

// TypeScript declaration for Vite's import.meta.glob

/**
 * Configuration object for easy management of constants.
 */
export const AppConfig: AppConfigType = {
  API_ENDPOINT: "/api/products", // Connects to our own server's endpoint
  PRODUCTS_PER_PAGE: 20,
  RETRY_COUNT: 3,
  RETRY_DELAY_MS: 1000,
};

/**
 * A utility to introduce a delay.
 * @param ms - The delay in milliseconds.
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Custom error class for API errors with proper typing
 */
export class ApiServiceError extends Error implements ApiError {
  statusCode?: number;
  details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = "ApiServiceError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Wraps the native fetch to provide automatic retries with exponential backoff.
 *
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param retries - The number of retries left
 * @param delayMs - The initial delay for the next retry
 * @returns The parsed JSON response
 * @throws ApiServiceError if the request fails after all retries
 */
export const fetchWithRetry = async <T>(
  url: string,
  options?: RequestInit,
  retries = AppConfig.RETRY_COUNT,
  delayMs = AppConfig.RETRY_DELAY_MS
): Promise<T> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      let errorDetails: unknown = undefined;

      try {
        // Try to parse error details from the response
        errorDetails = await response.json();
        if (typeof errorDetails === "object" && errorDetails && "message" in errorDetails) {
          errorMessage = String(errorDetails.message);
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }

      throw new ApiServiceError(errorMessage, response.status, errorDetails);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiServiceError) {
      if (retries <= 0) throw error;

      console.warn(
        `API call failed with status ${error.statusCode}. Retrying in ${delayMs}ms... (${retries} retries left)`
      );
    } else {
      if (retries <= 0) {
        console.error("API call failed after multiple retries.", error);
        throw new ApiServiceError(
          error instanceof Error ? error.message : "Unknown error occurred",
          undefined,
          error
        );
      }

      console.warn(`API call failed. Retrying in ${delayMs}ms... (${retries} retries left)`);
    }

    await delay(delayMs);
    return fetchWithRetry<T>(url, options, retries - 1, delayMs * 2);
  }
};

/**
 * Fetches paginated products from the server
 *
 * @param options - Fetch options with page parameter
 * @returns Paginated products response
 */
export const fetchProducts = async ({
  pageParam = 1,
}: {
  pageParam?: number;
}): Promise<PaginatedProductsResponse> => {
  const url = new URL(AppConfig.API_ENDPOINT, window.location.origin);
  url.searchParams.set("page", String(pageParam));

  try {
    return await fetchWithRetry<PaginatedProductsResponse>(url.toString());
  } catch (error) {
    // Log the detailed error and throw a user-friendly message
    console.error("Fetch products error:", error);

    if (error instanceof ApiServiceError) {
      throw error;
    }

    throw new ApiServiceError(
      "Could not load products. Please check your network connection.",
      undefined,
      error
    );
  }
};

// Image handling with proper typing
type ImageModule = () => Promise<{ default: string }>;
interface ImageCache {
  has(key: string): boolean;
  get(key: string): string | undefined;
  set(key: string, value: string): void;
}

// Use type assertion for import.meta.glob since TypeScript might not recognize it
const imageModules = import.meta.glob(
  "/src/assets/products/*.{jpg,jpeg,png,webp,gif,svg}"
) as Record<string, ImageModule>;
const sortedImagePaths = Object.keys(imageModules).sort();
const imageUrlCache: ImageCache = new LRUCache<string, string>({ max: 100 });

/**
 * Loads an image with retry logic
 *
 * @param path - The path to the image
 * @param retries - Number of retries
 * @param delayMs - Delay between retries in milliseconds
 * @returns The image URL
 */
const loadImageWithRetry = async (path: string, retries = 3, delayMs = 300): Promise<string> => {
  try {
    const module = await imageModules[path]();
    return module.default;
  } catch (error) {
    if (retries <= 0) {
      console.error(`Failed to load image ${path} after multiple retries.`, error);
      throw error;
    }
    await delay(delayMs);
    return loadImageWithRetry(path, retries - 1, delayMs * 2);
  }
};

/**
 * Gets an image URL by index with caching
 *
 * @param index - The index of the image
 * @returns The image URL or null if not found
 */
export const getImageUrlByIndex = async (index: number): Promise<string | null> => {
  if (index < 0 || index >= sortedImagePaths.length) {
    return null;
  }

  const path = sortedImagePaths[index];
  if (imageUrlCache.has(path)) {
    return imageUrlCache.get(path) || null;
  }

  try {
    const url = await loadImageWithRetry(path);
    if (url) {
      imageUrlCache.set(path, url);
    }
    return url;
  } catch (error) {
    console.error(`Failed to load image for index ${index}`, error);
    return null;
  }
};
