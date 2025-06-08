import dotenv from "dotenv";
import { AppConfigType } from "../../../shared/types";

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration
 * Centralizes all configuration values and provides defaults
 */
const AppConfig: AppConfigType = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  EXTERNAL_API_ENDPOINT:
    process.env.EXTERNAL_API_ENDPOINT ||
    "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft",
  API_ENDPOINT: "/api/products",
  PRODUCTS_PER_PAGE: process.env.PRODUCTS_PER_PAGE ? parseInt(process.env.PRODUCTS_PER_PAGE, 10) : 20,
  RETRY_COUNT: process.env.RETRY_COUNT ? parseInt(process.env.RETRY_COUNT, 10) : 3,
  RETRY_DELAY_MS: process.env.RETRY_DELAY_MS ? parseInt(process.env.RETRY_DELAY_MS, 10) : 1000,
  CACHE_MAX_ITEMS: process.env.CACHE_MAX_ITEMS ? parseInt(process.env.CACHE_MAX_ITEMS, 10) : 1,
  CACHE_MAX_AGE_MS: process.env.CACHE_MAX_AGE_MS 
    ? parseInt(process.env.CACHE_MAX_AGE_MS, 10) 
    : 1000 * 60 * 5, // 5 minutes
};

export default AppConfig; 