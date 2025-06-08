import { useState, useEffect } from "react";

/**
 * A custom hook that returns `true` once the component has mounted on the client.
 * This is useful for preventing server-client mismatches with UI that should
 * only render on the client.
 *
 * @returns {boolean} - `true` if mounted, `false` otherwise.
 */
export const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};
