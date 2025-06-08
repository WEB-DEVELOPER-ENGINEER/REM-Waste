import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/apiService";
import { Product } from "@shared/types";

// A unique key for this query.
const productsQueryKey = ["products"];

/**
 * Custom hook to fetch products with infinite scrolling support.
 * It encapsulates the data fetching logic using React Query's useInfiniteQuery.
 *
 * @returns An object containing the product data, loading states, and fetch functions.
 */
export const useProducts = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: productsQueryKey,
    queryFn: ({ pageParam }) => fetchProducts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // Flatten the pages array into a single array of products
  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return {
    products,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    // A consolidated loading state for initial fetch or background refetch
    isLoading: status === "pending" || isFetching,
    // A specific loading state for the initial data load
    isInitialLoading: status === "pending",
  };
}; 