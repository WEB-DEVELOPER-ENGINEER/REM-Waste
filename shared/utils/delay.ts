/**
 * Creates a promise that resolves after the specified number of milliseconds.
 * Useful for implementing controlled delays in async operations.
 * 
 * @param ms - The delay in milliseconds
 * @returns A promise that resolves after the specified delay
 */
export const delay = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms)); 