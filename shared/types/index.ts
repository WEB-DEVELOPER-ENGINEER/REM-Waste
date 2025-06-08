/**
 * Core product types used throughout the application
 */

export interface RawProduct {
  id: number;
  size: number;
  hire_period_days: number;
  transport_cost: number | null;
  per_tonne_cost: number | null;
  price_before_vat: number;
  vat: number;
  postcode: string;
  area: string;
  forbidden: boolean;
  created_at: string;
  updated_at: string;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string; // Formatted price with VAT
  imageUrl: string | null;
  allowed_on_road: boolean;
  size: number;
  hire_period_days: number;
  postcode: string;
  isNew?: boolean;
  rating?: number; // Keep these for potential future use
  reviewCount?: number; // Keep these for potential future use
}

export interface PaginatedProductsResponse {
  products: Product[];
  nextPage?: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Application state types
 */
export interface ProductsState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

/**
 * Configuration types
 */
export interface AppConfigType {
  API_ENDPOINT: string;
  PRODUCTS_PER_PAGE: number;
  RETRY_COUNT: number;
  RETRY_DELAY_MS: number;
  CACHE_MAX_ITEMS?: number;
  CACHE_MAX_AGE_MS?: number;
  PORT?: number;
  EXTERNAL_API_ENDPOINT?: string;
} 