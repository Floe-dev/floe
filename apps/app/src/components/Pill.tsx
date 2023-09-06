import cn from "classnames";

const colors = {
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-700",
  indigo: "bg-indigo-100 text-indigo-700",
  yellow: "bg-yellow-100 text-yellow-700",
};

interface PillProps {
  text: string;
  fontStlye?: "sans" | "mono";
  color?: keyof typeof colors;
}

export const Pill = ({ text, color = "indigo", fontStlye = "sans" }: PillProps) => {
  return (
    <span
      className={cn(`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[color]}`, {
        "font-mono": fontStlye === "mono",
        "font-sans": fontStlye === "sans",
      })}
    >
      {text}
    </span>
  );
};
