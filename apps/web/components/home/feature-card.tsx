import Link from "next/link";
import { Button, Pill } from "@floe/ui";

export function FeatureCard({
  pillText,
  title,
  description,
  children,
}: {
  pillText: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative z-10 px-10 py-8 -mx-10 text-center rounded-lg shadow-lg md:mx-auto sm:w-2/3 bg-gradient-to-t from-amber-500 bg-amber-400 after:absolute after:bg-noise after:inset-0 after:opacity-60 after:-z-10">
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
