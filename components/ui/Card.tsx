import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "concrete" | "outline";
}

export function Card({
  children,
  className,
  variant = "glass",
  ...props
}: CardProps) {
  const baseStyles = "p-6 relative overflow-hidden";

  const variants = {
    glass: "glass-fragment", // Defined in globals.css
    concrete: "bg-carbon-800 border-2 border-carbon-700",
    outline: "border-2 border-dashed border-carbon-600 bg-transparent",
  };

  return (
    <div className={twMerge(baseStyles, variants[variant], className)} {...props}>
      {/* Decorative corner markers typical in brutalist/technical UI */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current opacity-50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current opacity-50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-50" />

      {children}
    </div>
  );
}
