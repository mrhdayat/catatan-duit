import React from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "neon" | "ghost";
  href?: string;
}

export function Button({
  children,
  className,
  variant = "solid",
  href,
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-6 py-3 font-mono text-sm uppercase font-bold tracking-wider transition-all active:translate-y-1 active:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black inline-block text-center";

  const variants = {
    solid:
      "bg-carbon-100 text-black border-2 border-carbon-100 hover:bg-white hover:border-white shadow-[4px_4px_0px_#333]",
    outline:
      "bg-transparent text-carbon-100 border-2 border-carbon-500 hover:border-white hover:text-white hover:shadow-[4px_4px_0px_#e0e0e0]",
    neon: "bg-neon-green text-black border-2 border-neon-green hover:bg-[#2eff00] shadow-[0_0_10px_rgba(57,255,20,0.5)] hover:shadow-[0_0_20px_rgba(57,255,20,0.8)]",
    ghost: "bg-transparent text-carbon-400 hover:text-white hover:bg-carbon-800",
  };

  const combinedStyles = twMerge(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
}
