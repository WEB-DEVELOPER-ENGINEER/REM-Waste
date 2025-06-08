import React, { useState, useEffect, useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import { useProductSelection } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import StickyFooter from "../components/StickyFooter";
import ProductListLayout from "../components/ProductListLayout";
import { Product } from "@shared/types";
import { ArrowUp } from "lucide-react";
import { useIsMounted } from "../hooks/useIsMounted";
import { useNavigate } from "react-router-dom";

interface ProductSkeletonCardProps {
  count?: number;
}

const ProductSkeletonCard: React.FC<ProductSkeletonCardProps> = ({ count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div key={i} className="w-full p-2 animate-pulse">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200" />
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded-full mr-1"></div>
            ))}
            <div className="w-8 h-3 bg-gray-200 rounded ml-1"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  ));

  return <>{skeletons}</>;
};

interface ScrollToTopButtonProps {
  visible: boolean;
  onClick: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ visible, onClick }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: visible ? 1 : 0,
      y: visible ? 0 : 20,
      transition: { duration: 0.2 },
    }}
    onClick={onClick}
    className="fixed bottom-6 right-6 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200
               border border-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    aria-label="Scroll to top"
  >
    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      />
    </svg>
  </motion.button>
);

const ProductList: React.FC = () => {
  const {
    products,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
  } = useProducts();
  const { selectedProduct, selectProduct } = useProductSelection();
  const isMounted = useIsMounted();
  const navigate = useNavigate();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectProduct = (product: Product) => {
    selectProduct(selectedProduct && selectedProduct.id === product.id ? null : product);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getBreakpoint = (width: number) => {
    if (width >= 1280) return "xl";
    if (width >= 1024) return "lg";
    if (width >= 640) return "sm";
    return "base";
  };

  const getColumnsForBreakpoint = (breakpoint: string) => {
    switch (breakpoint) {
      case "xl":
        return 3;
      case "lg":
        return 2;
      case "sm":
        return 2;
      default:
        return 1;
    }
  };

  const breakpoint = getBreakpoint(windowWidth);
  const columns = getColumnsForBreakpoint(breakpoint);
  const rowCount = Math.ceil(products.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? rowCount + 1 : rowCount,
    estimateSize: useCallback(() => 500, []),
    overscan: 5,
    getScrollElement: () => (typeof window !== "undefined" ? window.document.documentElement : null),
  });

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= rowCount - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    products.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
    rowCount,
  ]);

  return (
    <ProductListLayout
      loading={isInitialLoading}
      hasSelection={!!selectedProduct}
      error={error ? error.message : null}
    >
      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />

      {isInitialLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductSkeletonCard count={8} />
        </div>
      )}

      {error && !isInitialLoading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isInitialLoading && !error && products.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 mb-4">
            <svg
              className="h-12 w-12 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
          <p className="text-gray-500 mb-6">
            We could not find any products matching your criteria.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh results
          </button>
        </div>
      )}

      <div
        ref={parentRef}
        className="relative"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full"
          style={{
            transform: `translateY(${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > products.length - 1;
            const startIndex = virtualRow.index * columns;
            const rowProducts = products.slice(startIndex, startIndex + columns);

            if (isLoaderRow) {
              return (
                <div
                  key="loader"
                  className="flex justify-center items-center p-8 col-span-full"
                  style={{ height: "100px" }}
                >
                  {hasNextPage && !isFetchingNextPage && (
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="w-full flex flex-row flex-nowrap py-2"
              >
                {rowProducts.map((product) => (
                  <div key={product.id} className="p-2" style={{ width: `${100 / columns}%` }}>
                    <ProductCard
                      product={product}
                      isSelected={selectedProduct?.id === product.id}
                      onSelect={handleSelectProduct}
                      isLoading={isInitialLoading}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {isFetchingNextPage && (
        <div className="mt-8 text-center p-8">
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading more products...
          </div>
        </div>
      )}

      <StickyFooter
        selectedProduct={selectedProduct}
        onClear={() => selectProduct(null)}
      />
    </ProductListLayout>
  );
};

export default ProductList;
