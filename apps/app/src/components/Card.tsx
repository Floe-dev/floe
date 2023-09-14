import { Button, ButtonProps } from "./Button";

export interface CardProps {
  title: string;
  subtitle?: string;
  actions?: {
    text: string;
    type?: ButtonProps["type"];
    variant?: ButtonProps["variant"];
    onClick: () => void;
  }[];
  bottomActions?: {
    text: string;
    type?: ButtonProps["type"];
    variant?: ButtonProps["variant"];
    onClick: () => void;
  }[];
  children: React.ReactNode;
}

export const Card = ({
  title,
  subtitle,
  actions,
  bottomActions,
  children,
}: CardProps) => (
  <div className="bg-white rounded-lg shadow">
    <div className="px-6 py-5 bg-white border-b border-gray-200 rounded-t-lg">
      <div className="flex items-center justify-between -mt-2 -ml-4 flex-nowrap">
        <div className="mt-2 ml-4">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </h3>
          {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex-shrink-0 mt-2 ml-4">
          {actions?.map((action) => (
            <Button
              onClick={() => {
                action.onClick();
              }}
              key={action.text}
              type={action.type}
              variant={action.variant}
            >
              {action.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
    {bottomActions?.length && (
      <div className="px-6 py-3 bg-gray-100 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between -mt-2 -ml-4 flex-nowrap">
          <div className="flex-shrink-0 mt-2 ml-auto">
            {bottomActions?.map((action) => (
              <Button
                onClick={() => {
                  action.onClick();
                }}
                key={action.text}
                type={action.type}
                variant={action.variant}
              >
                {action.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);
