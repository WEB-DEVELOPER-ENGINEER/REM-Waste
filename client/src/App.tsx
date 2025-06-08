import React, { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Spinner from "./components/Spinner";
import Layout from "./layout/Layout";
import { ProductProvider } from "./context/ProductContext";

// Lazy load pages for better performance
const ProductList = React.lazy(() => import("./pages/ProductList"));
const NotFound = React.lazy(() => import("./pages/404"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Optional: disable refetch on window focus
    },
  },
});

/**
 * Main application component
 * Provides context providers, routing, and suspense fallback
 */
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductProvider>
        <Suspense
          fallback={
            <Layout>
              <Spinner size={100} />
            </Layout>
          }
        >
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#333",
              },
            }}
          />
          <Routes>
            <Route index element={<ProductList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ProductProvider>
    </QueryClientProvider>
  );
};

export default App;
