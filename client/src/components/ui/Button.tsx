import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant that changes the visual style
   */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";

  /**
   * Button size
   */
  size?: "sm" | "md" | "lg";

  /**
   * Whether the button is in loading state
   */
  isLoading?: boolean;

  /**
   * Whether to use motion animation
   */
  animate?: boolean;

  /**
   * Icon to display before the button text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;

  /**
   * Whether the button is full width
   */
  fullWidth?: boolean;

  /**
   * Button children
   */
  children: React.ReactNode;
}

/**
 * Primary UI component for user interaction
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      animate = true,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    // Size styles
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    // Variant styles
    const variantStyles = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
      outline:
        "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    // Disabled styles
    const disabledStyles = "opacity-50 cursor-not-allowed";

    // Full width style
    const widthStyle = fullWidth ? "w-full" : "";

    // Combine all styles
    const buttonStyles = `
      ${baseStyles}
      ${sizeStyles[size]}
      ${variantStyles[variant]}
      ${disabled || isLoading ? disabledStyles : ""}
      ${widthStyle}
      ${className}
    `;

    // Button content
    const content = (
      <>
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    );

    // Return either a motion button or a regular button
    return animate ? (
      <motion.button
        ref={ref}
        className={buttonStyles}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        {...props}
      >
        {content}
      </motion.button>
    ) : (
      <button ref={ref} className={buttonStyles} disabled={disabled || isLoading} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
