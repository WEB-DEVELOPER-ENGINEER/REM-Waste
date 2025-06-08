import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { Windmill } from "@windmill/react-ui";
import App from "./App";
import "./index.css";

/**
 * Main entry point for the client application
 * Wraps the App component with necessary providers:
 * - HelmetProvider for managing document head
 * - Windmill UI provider for styling
 * - BrowserRouter for routing
 */
const container = document.getElementById("root");

// Ensure container exists
if (!container) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Windmill>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Windmill>
    </HelmetProvider>
  </React.StrictMode>
);
