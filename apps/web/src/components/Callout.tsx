import { ReactNode } from "react";

export const Callout = (props: {
  children: ReactNode;
  type?: "caution" | "check" | "info" | "warning" | "docs" | "tada";
}) => {
  const icons = {
    caution: "⚠️",
    check: "✅",
    info: "ℹ️",
    warning: "⚠️",
    docs: "📖",
    tada: "🎉",
  };

  return (
    <div className="flex gap-4 p-4 my-5 rounded-lg shadow bg-black/5 dark:bg-white/10">
      <div className="m-0">{icons[props.type ?? "info"]}</div>
      <div className="[&>p]:m-0">{props.children}</div>
    </div>
  );
};
