import { Pill } from "@floe/ui";

const colors = {
  amber: "from-amber-500 bg-amber-400",
  rose: "from-rose-500 bg-rose-400",
  indigo: "from-indigo-500 bg-indigo-400",
  emerald: "from-emerald-500 bg-emerald-400",
  purple: "from-purple-500 bg-purple-400",
};

export function FeatureCard({
  pillText,
  title,
  description,
  color,
  children,
}: {
  pillText: string;
  title: string;
  description: string;
  color: keyof typeof colors;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative ${colors[color]} z-10 px-10 py-8 -mx-10 text-center rounded-lg shadow-lg md:mx-auto md:w-2/3 bg-gradient-to-t after:absolute after:bg-noise after:inset-0 after:opacity-60 after:-z-10`}
    >
      <Pill color="black" text={pillText} />
      <h3 className="mt-3 mb-3 text-4xl sm:text-5xl font-garamond">{title}</h3>
      <p className="mb-8 text-lg sm:text-xl text-zinc-700">
        {description.split("\\n").map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </p>
      {children}
    </div>
  );
}
