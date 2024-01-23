export function Card({
  icon,
  title,
  description,
}: {
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
}) {
  const Icon = icon;

  return (
    <div className="relative z-10 px-10 py-8 bg-white rounded-lg shadow-lg bg-opacity-70">
      <Icon className="h-8 mb-3 md:h-10 text-zinc-800" />
      <h3 className="mb-3 text-2xl sm:text-3xl font-garamond">{title}</h3>
      <p className="text-md sm:text-lg text-zinc-600">{description}</p>
    </div>
  );
}
