import fetch, { RequestInit, Response } from "node-fetch";
import { delay } from "../../../shared/utils/delay";
import AppConfig from "../config/index";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
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
 * @throws ApiError if the request fails after all retries
 */
export const fetchWithRetry = async <T>(
  url: string,
  options?: RequestInit,
  retries = AppConfig.RETRY_COUNT,
  delayMs = AppConfig.RETRY_DELAY_MS
): Promise<T> => {
  try {
    const response: Response = await fetch(url, options);
    
    if (!response.ok) {
      throw new ApiError(`API Error: ${response.status} ${response.statusText}`, response.status);
    }
    
    return await response.json() as T;
  } catch (error) {
    if (retries <= 0) {
      console.error("API call failed after multiple retries.", error);
      throw error;
    }
    
    const isApiError = error instanceof ApiError;
    const errorMessage = isApiError 
      ? `API call failed with status ${(error as ApiError).statusCode}.` 
      : 'API call failed.';
    
    console.warn(`${errorMessage} Retrying in ${delayMs}ms... (${retries} retries left)`);
    await delay(delayMs);
    return fetchWithRetry<T>(url, options, retries - 1, delayMs * 2);
  }
}; 