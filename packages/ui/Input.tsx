import { InputHTMLAttributes, forwardRef, useId } from "react";
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
  ({ icon, label, subtext, className, errortext, textarea, ...args }, ref) => {
    let inputId = useId();
    const Icon = icon;
    const InputEl = textarea ? `textarea` : `input`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="inline-block mb-2 text-sm font-medium leading-6 text-gray-900 dark:text-white"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </div>
          )}
          <InputEl
            {...args}
            // @ts-ignore
            ref={ref}
            id={inputId}
            className={cn(
              `block w-full bg-white/30 dark:bg-white/5 rounded-md border-0 py-2 pl-10 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm`,
              {
                "pl-3": !Icon,
              }
            )}
          />
        </div>
        {(subtext || errortext) && (
          <p
            className={cn("mt-2 text-sm text-gray-500", {
              "text-red-500": errortext,
            })}
          >
            {errortext || subtext}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
