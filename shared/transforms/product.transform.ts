import { Product, RawProduct } from '../types';

/**
 * Formats the price by calculating VAT and adding a currency symbol.
 * @param priceBeforeVat - Price before Value Added Tax.
 * @param vat - VAT percentage.
 * @returns A formatted price string (e.g., "£333.60").
 */
const formatPrice = (priceBeforeVat: number, vat: number): string => {
  if (priceBeforeVat === undefined || priceBeforeVat === null) return "£0.00";
  const numericPrice =
    typeof priceBeforeVat === "string"
      ? parseFloat(priceBeforeVat)
      : priceBeforeVat;
  if (isNaN(numericPrice)) return "£0.00";

  const totalPrice = numericPrice * (1 + vat / 100);
  return `£${totalPrice.toFixed(2)}`;
};

/**
 * A simple pseudo-random number generator for deterministic data.
 * This is used for generating mock ratings and review counts.
 * @param seed - A number to seed the generator.
 * @returns A pseudo-random number between 0 and 1.
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Transforms the raw, verbose product data from the API into a slim,
 * optimized object, containing only the data needed for the UI.
 *
 * @param rawProduct - The raw product object from the API
 * @returns A slimmed-down product object with consistent properties
 */
export const transformProductData = (rawProduct: RawProduct): Product => {
  const isNew = () => {
    const createdAt = new Date(rawProduct.created_at);
    const now = new Date();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    return now.getTime() - createdAt.getTime() < oneMonth;
  };

  return {
    id: rawProduct.id,
    title: `${rawProduct.size} Yard Skip`,
    description: `${rawProduct.hire_period_days}-day hire period.`,
    price: formatPrice(rawProduct.price_before_vat, rawProduct.vat),
    imageUrl: null, // This will be set in a separate step
    allowed_on_road: rawProduct.allowed_on_road,
    size: rawProduct.size,
    hire_period_days: rawProduct.hire_period_days,
    postcode: rawProduct.postcode,
    isNew: isNew(),
    rating: Math.floor(seededRandom(rawProduct.id + 1) * 4) + 2, // Mock rating: 2-5 stars
    reviewCount: Math.floor(seededRandom(rawProduct.id + 2) * 200), // Mock reviews
  };
}; 