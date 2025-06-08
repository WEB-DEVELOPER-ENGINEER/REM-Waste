import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { X, ZoomIn, ZoomOut } from "lucide-react";

// Ensure Modal is accessible
Modal.setAppElement("#root");

interface ImagePreviewModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, onRequestClose, imageUrl }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset zoom level when modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, imageUrl]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Image Preview"
      className="fixed inset-0 flex items-center justify-center p-4 z-50 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
      closeTimeoutMS={300}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Image Preview</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Zoom out"
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Zoom in"
              disabled={zoomLevel >= 3}
            >
              <ZoomIn className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onRequestClose}
              className="p-2 rounded-full hover:bg-gray-100 ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="relative h-[60vh] overflow-auto bg-gray-100 flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {hasError ? (
            <div className="flex flex-col items-center justify-center text-gray-500 p-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📷</span>
              </div>
              <p className="text-lg font-medium">Image could not be loaded</p>
              <p className="text-sm mt-2">The image might be unavailable or there was an error loading it.</p>
            </div>
          ) : (
            <div
              className="transition-transform duration-200 ease-in-out"
              style={{
                transform: `scale(${zoomLevel})`,
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-500">
            Use the zoom controls to get a closer look at the product details.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ImagePreviewModal; 