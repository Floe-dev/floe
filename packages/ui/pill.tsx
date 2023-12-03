import cn from "classnames";

const colors = {
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  yellow: "bg-yellow-100 text-yellow-700",
  black: "bg-zinc-100 text-zinc-700",
};

interface PillProps {
  text: string;
  fontStlye?: "sans" | "mono";
  color?: keyof typeof colors;
}

export function Pill({ text, color = "amber", fontStlye = "sans" }: PillProps) {
  return (
    <span
      className={cn(
        `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[color]}`,
        {
          "font-mono": fontStlye === "mono",
          "font-sans": fontStlye === "sans",
        }
      )}
    >
      {text}
    </span>
  );
}
