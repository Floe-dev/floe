import { ForwardRefExoticComponent, SVGProps, RefAttributes } from "react";

export interface EmptyStateProps {
  icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  const Icon = icon;

  return (
    <div className="p-8 text-center">
      <Icon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
};
