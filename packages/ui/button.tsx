"use client";

import React, { forwardRef } from "react";
import type { DetailedHTMLProps } from "react";
import cn from "classnames";

type Variants = "contained" | "text";

const classes = {
  base: "focus:outline-none inline-flex gap-2 items-center whitespace-nowrap flex-shrink-0 font-medium disabled:opacity-75 justify-center",
  disabled: "opacity-50 cursor-not-allowed pointer-events-none",
  pill: "rounded-full",
  size: {
    sm: "px-2 py-1 text-xs rounded shadow-sm",
    md: "px-3 py-2 text-sm rounded-md shadow-sm",
    lg: "px-3.5 py-2.5 rounded-md shadow-md",
    xl: "px-4 py-3 text-lg rounded-lg shadow-lg",
  },
  iconSize: {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
  },
  colors: {
    primary: {
      contained:
        "text-white bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50",
      text: "hover:bg-zinc-950/10 text-amber-700 !shadow-none",
    },
    secondary: {
      contained:
        "text-white bg-zinc-800 hover:bg-zinc-900 focus:ring-2 focus:ring-amber-700 focus:ring-opacity-50",
      text: "hover:bg-zinc-950/10 text-zinc-700 !shadow-none",
    },
  },
} as const;

export interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  className?: string;
  variant?: Variants;
  color?: keyof typeof classes.colors;
  disabled?: boolean;
  pill?: boolean;
  size?: keyof typeof classes.size;
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
      color = "primary",
      variant = "contained",
      size = "md",
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
        className={cn(
          `
          ${classes.base}
          ${classes.size[size]}
          ${classes.colors[color][variant]}
      `,
          {
            ...(className && {
              [className]: className,
            }),
            [classes.pill]: pill,
            [classes.disabled]: disabled,
          }
        )}
        disabled={disabled}
        ref={ref}
        type={type}
        {...props}
      >
        {Icon ? <Icon className={cn(`${classes.iconSize[size]}`)} /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
