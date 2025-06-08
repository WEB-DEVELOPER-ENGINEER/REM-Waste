import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Get the current file's directory path
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Path to product images directory
 */
const IMAGES_DIR = path.resolve(__dirname, "../../../client/public/images/products");

/**
 * Array of image paths
 */
let imagePaths: string[] = [];

try {
  // Read the images directory
  const files = fs.readdirSync(IMAGES_DIR);
  
  // Filter for image files and sort them
  imagePaths = files
    .filter((file) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file))
    .sort()
    .map((file) => `/images/products/${file}`);

  if (imagePaths.length === 0) {
    console.warn("Warning: No product images found in", IMAGES_DIR);
  }
} catch (error) {
  console.error(
    `Error: Could not read product images directory at ${IMAGES_DIR}. ` +
    `Please ensure images are placed in client/public/images/products.`, 
    error
  );
}

/**
 * Gets an image URL by index, with wrapping for out-of-bounds indices
 * 
 * @param index - Index of the image to retrieve
 * @returns URL of the image or null if no images are available
 */
export const getImageUrlByIndex = (index: number): string | null => {
  if (imagePaths.length === 0) {
    return null;
  }
  
  // Use modulo to wrap around if index exceeds array length
  return imagePaths[index % imagePaths.length];
}; 