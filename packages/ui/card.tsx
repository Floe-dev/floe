interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function Card({ title, className, children }: CardProps) {
  return (
    <div className={className}>
      {title ? (
        <h3 className="mb-2 text-sm font-medium text-zinc-500">{title}</h3>
      ) : null}
      <div className="px-6 py-5 bg-white shadow rounded-xl">{children}</div>
    </div>
  );
}
