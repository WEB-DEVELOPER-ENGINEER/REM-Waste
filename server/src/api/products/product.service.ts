import { fetchWithRetry } from "../../services/externalApiService";
import { transformProductData } from "../../../../shared/transforms/product.transform";
import AppConfig from "../../config/index";
import { getImageUrlByIndex } from "../../services/image.service.server";
import { Product, PaginatedProductsResponse, RawProduct } from "@shared/types";

interface FetchPaginatedOptions {
  page?: number;
}

/**
 * Fetches and transforms a paginated list of products from the external API.
 *
 * @param options - Pagination options, including the page number.
 * @returns A promise that resolves to a paginated products response.
 */
export const fetchPaginatedProducts = async ({
  page = 1,
}: FetchPaginatedOptions): Promise<PaginatedProductsResponse> => {
  const pageParam = page || 1;
  const url = `${AppConfig.EXTERNAL_API_ENDPOINT}?page=${pageParam}&limit=${AppConfig.PRODUCTS_PER_PAGE}`;

  // Assuming the API returns an array of RawProduct for the given page
  const rawProducts = await fetchWithRetry<RawProduct[]>(url, {
    headers: { Accept: "application/json" },
  });

  if (!Array.isArray(rawProducts)) {
    // Or handle cases where the API wraps the list in a data property
    throw new Error("API response does not contain a valid product array");
  }

  const products = rawProducts.map((product) => {
    const transformed = transformProductData(product);
    // Use the numeric product ID to deterministically assign an image
    transformed.imageUrl = getImageUrlByIndex(product.id);
    return transformed;
  });

  return {
    products,
    // The next page exists if we received a full page of products
    nextPage:
      rawProducts.length === AppConfig.PRODUCTS_PER_PAGE ? pageParam + 1 : undefined,
  };
};

/**
 * Gets a single product by its ID from the external API.
 *
 * @param id - The ID of the product to fetch.
 * @returns A promise that resolves to a transformed Product or null if not found.
 */
export const getProductById = async (
  id: string | number
): Promise<Product | null> => {
  const url = `${AppConfig.EXTERNAL_API_ENDPOINT}/${id}`;

  try {
    const rawProduct = await fetchWithRetry<RawProduct>(url, {
      headers: { Accept: "application/json" },
    });

    if (!rawProduct) {
      return null;
    }

    const transformed = transformProductData(rawProduct);
    // Use the numeric product ID to deterministically assign an image
    transformed.imageUrl = getImageUrlByIndex(rawProduct.id);

    return transformed;
  } catch (error) {
    // If the API returns a 404, fetchWithRetry might throw.
    // We can inspect the error and return null for 404s.
    // For now, we'll log it and return null for any error.
    console.error(`Failed to fetch product with id ${id}:`, error);
    return null;
  }
}; 