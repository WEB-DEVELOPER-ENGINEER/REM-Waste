import React from "react";
import { motion } from "framer-motion";
import { Product } from "@shared/types";
import { ShoppingCart, ChevronRight, X } from "lucide-react";

interface StickyFooterProps {
  selectedProduct: Product | null;
  onClear: () => void;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ selectedProduct, onClear }) => {
  if (!selectedProduct) return null;

  const finalPrice = parseFloat(selectedProduct.price?.replace(/[^0-9.]/g, "") || "0").toFixed(2);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden mr-3 sm:mr-4 bg-gray-100">
              {selectedProduct.imageUrl ? (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <ShoppingCart className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <button
                onClick={onClear}
                className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm p-0.5 rounded-bl-md"
                aria-label="Remove selection"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1">
                {selectedProduct.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm line-clamp-1">
                {selectedProduct.description}
              </p>
            </div>
          </div>

          <div className="flex items-center w-full sm:w-auto">
            <div className="mr-4 text-right">
              <p className="text-xs text-gray-500">Price:</p>
              <p className="text-lg font-bold text-gray-900">£{finalPrice}</p>
            </div>
            <button
              onClick={() => {
                /* No action */
              }}
              className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-6 rounded-lg font-medium flex items-center justify-center transition-colors mr-2"
              aria-label="Back"
            >
              Back
            </button>
            <button
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium flex items-center justify-center transition-colors"
              aria-label="Continue with selected product"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Imagery and information shown throughout this website may not reflect the exact shape or
          size specification, colours may vary, options and/or accessories may be featured at
          additional cost.
        </p>
      </div>
    </motion.div>
  );
};

export default StickyFooter;
