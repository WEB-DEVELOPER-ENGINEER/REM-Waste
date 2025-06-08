import React, { useState } from "react";
import Stepper from "./Stepper";

interface ProductListLayoutProps {
  children: React.ReactNode;
  loading: boolean;
  hasSelection: boolean;
  error: string | null;
}

const ProductListLayout: React.FC<ProductListLayoutProps> = ({
  children,
  loading,
  hasSelection,
  error,
}) => {
  const [currentStep, setCurrentStep] = useState("Select Skip");

  const handleStepChange = (stepId: string) => {
    // In a real app, you would validate if the user can move to this step
    setCurrentStep(stepId);
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        hasSelection ? "pb-32" : ""
      } transition-all duration-200`}
    >
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center py-4">
            <div className="flex items-center space-x-4">
              {!error && loading && (
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Loading...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <Stepper currentStepId={currentStep} onStepClick={handleStepChange} />
        {loading && (
          <div className="h-1 w-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-blue-500 animate-pulse"
              style={{
                width: "100%",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          </div>
        )}
      </header>
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
        role="main"
        aria-labelledby="page-title"
      >
        <div className="text-center mb-6 sm:mb-8 lg:mb-10 mx-auto max-w-3xl">
          <h1
            id="page-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight"
          >
            Choose Your Skip Size
          </h1>
          <p
            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl mx-auto leading-relaxed"
            aria-describedby="page-title"
          >
            Select the skip size that best suits your needs
          </p>
        </div>
        <div className="relative">{children}</div>
      </main>
    </div>
  );
};

export default ProductListLayout; 