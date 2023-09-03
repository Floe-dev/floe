"use client";

import React, { forwardRef, DetailedHTMLProps } from "react";
import cn from "classnames";

const classes = {
  base: "focus:outline-none shadow-sm inline-flex gap-2 items-center whitespace-nowrap flex-shrink-0 font-medium disabled:opacity-75",
  disabled: "opacity-50 cursor-not-allowed",
  pill: "rounded-full",
  size: {
    small: "px-2 py-1 text-xs rounded",
    medium: "px-3 py-2 text-sm rounded-md",
    large: "px-3.5 py-2.5 rounded-md",
  },
  iconSize: {
    small: "h-3 w-3",
    medium: "h-4 w-4",
    large: "h-5 w-5",
  },
  variant: {
    primary:
      "text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50",
    secondary:
      "bg-indigo-100 hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-indigo-900",
    outline:
      "bg-white border border-stone-200 rounded-lg focus:outline-none hover:bg-stone-50",
    error:
      "bg-red-100 hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-red-900",
  },
};

export interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "error";
  disabled?: boolean;
  pill?: boolean;
  size?: "small" | "medium" | "large";
  icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps &
    DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
>(
  (
    {
      children,
      type = "button",
      className,
      variant = "primary",
      size = "medium",
      pill,
      disabled = false,
      icon,
      ...props
    },
    ref
  ) => {
    const Icon = icon;

    return (
      <button
        ref={ref}
        disabled={disabled}
        type={type}
        className={cn(
          `
          ${classes.base}
          ${classes.size[size]}
          ${classes.variant[variant]}
      `,
          {
            [className as string]: className,
            [classes.pill]: pill,
            [classes.disabled]: disabled,
          }
        )}
        {...props}
      >
        {Icon && <Icon className={cn(`${classes.iconSize[size]}`)} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
