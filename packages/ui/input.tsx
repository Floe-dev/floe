import type { InputHTMLAttributes } from "react";
import { forwardRef, useId } from "react";
import cn from "classnames";

type InputProps = {
  label?: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
  subtext?: string;
  errortext?: string;
  textarea?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, label, subtext, errortext, textarea, ...args }, ref) => {
    const inputId = useId();
    const Icon = icon;
    const InputEl = textarea ? `textarea` : `input`;

    return (
      <div className="w-full">
        {label ? (
          <label
            className="inline-block mb-2 text-sm font-medium leading-6 text-gray-900"
            htmlFor={inputId}
          >
            {label}
          </label>
        ) : null}
        <div className="relative rounded-md shadow-sm">
          {Icon ? (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon aria-hidden="true" className="w-5 h-5 text-gray-400" />
            </div>
          ) : null}
          <InputEl
            {...args}
            className={cn(
              `block w-full bg-white/50 rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 text-sm`,
              {
                "pl-3": !Icon,
                "text-zinc-500": args.disabled,
              }
            )}
            id={inputId}
            // @ts-expect-error -- The type is fine
            ref={ref}
          />
        </div>
        {subtext || errortext ? (
          <p
            className={cn("mt-2 text-sm text-gray-500", {
              "text-red-500": errortext,
            })}
          >
            {errortext || subtext}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
