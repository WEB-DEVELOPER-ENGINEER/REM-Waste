import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Product } from "@shared/types";

// The context is responsible for managing the selected product,
// as data fetching is handled by React Query.
interface ProductSelectionContextType {
  selectedProduct: Product | null;
  selectProduct: (product: Product | null) => void;
}

const ProductSelectionContext = createContext<
  ProductSelectionContextType | undefined
>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const selectProduct = useCallback((product: Product | null) => {
    setSelectedProduct(product);
  }, []);

  const value = {
    selectedProduct,
    selectProduct,
  };

  return (
    <ProductSelectionContext.Provider value={value}>
      {children}
    </ProductSelectionContext.Provider>
  );
};

// Custom hook to access the selection context
export const useProductSelection = (): ProductSelectionContextType => {
  const context = useContext(ProductSelectionContext);
  if (context === undefined) {
    throw new Error(
      "useProductSelection must be used within a ProductProvider"
    );
  }
  return context;
};
