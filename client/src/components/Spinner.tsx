import React from "react";
import { ClipLoader } from "react-spinners";

interface SpinnerProps {
  css?: React.CSSProperties;
  size?: number;
  loading?: boolean;
  color?: string;
}

/**
 * Reusable spinner component for loading states
 */
const Spinner: React.FC<SpinnerProps> = ({
  css,
  size = 50,
  loading = true,
  color = "#3b82f6", // Tailwind blue-500
}) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <ClipLoader
        color={color}
        loading={loading}
        size={size}
        cssOverride={css}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Spinner;
