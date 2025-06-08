import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Eye, Star, Loader2, AlertTriangle } from "lucide-react";
import { Product } from "@shared/types";
import ImagePreviewModal from "./ImagePreviewModal";

const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

interface ImageSkeletonProps {}

const ImageSkeleton: React.FC<ImageSkeletonProps> = () => (
  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-xl" />
);

interface OptimizedImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handlePreviewOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };

  if (hasError) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400">
        <div className="p-4 bg-white rounded-full mb-3">
          <div className="w-8 h-8 text-gray-300">📷</div>
        </div>
        <p className="text-sm font-medium text-gray-500">Image not available</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative w-full h-64 overflow-hidden rounded-xl group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isLoaded && <ImageSkeleton />}
        <img
          src={src || PLACEHOLDER_IMAGE}
          alt={alt}
          className={`${className} w-full h-full object-cover transition-transform duration-700 ease-in-out ${
            isHovered ? "scale-110" : "scale-100"
          } ${isLoaded ? "opacity-100" : "opacity-0 absolute"}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black/20 flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                aria-label="Quick view"
                onClick={handlePreviewOpen}
              >
                <Eye className="w-5 h-5 text-gray-800" />
              </button>
              <button
                type="button"
                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                aria-label="Add to wishlist"
              >
                <Heart className="w-5 h-5 text-rose-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={handlePreviewClose}
        imageUrl={src}
      />
    </>
  );
};

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isSelected?: boolean;
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isSelected = false,
  isLoading = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLoading || isAdding) return;

    setIsAdding(true);
    try {
      await onSelect(product);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div
        className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
          isSelected
            ? "ring-2 ring-blue-500 shadow-xl"
            : "shadow-md hover:shadow-xl border border-gray-100"
        }`}
      >
        <div className="absolute top-3 left-3 z-10 flex gap-2">
        </div>

        <div className="relative">
          <OptimizedImage
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-64 object-cover"
          />
          {!product.allowed_on_road && (
            <div className="absolute top-3 right-3 z-10 bg-red-600 text-white px-2.5 py-1.5 rounded-md shadow-lg flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="text-xs font-semibold leading-none">Not Allowed On The Road</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 h-14">
              {product.title}
            </h3>
          </div>

          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(product.rating || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
                aria-hidden="true"
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
          </div>

          <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">{product.price}</span>
            </div>

            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={isLoading || isAdding}
              className={`relative flex items-center justify-center p-2 rounded-full ${
                isSelected
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } transition-colors`}
              whileTap={{ scale: 0.95 }}
              aria-label={isSelected ? "Remove from cart" : "Add to cart"}
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isSelected ? (
                <>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                    ✓
                  </span>
                  <ShoppingCart className="w-5 h-5" />
                </>
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
