import React from "react";
import { Helmet } from "react-helmet-async";
import Spinner from "../components/Spinner";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  loading?: boolean;
  description?: string;
}

/**
 * Main layout component that wraps all pages
 * Provides consistent page structure and meta tags
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  title = "REM Waste",
  loading = false,
  description = "Ecommerce store",
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size={60} />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default Layout;
