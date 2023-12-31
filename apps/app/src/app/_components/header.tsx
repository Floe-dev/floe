interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <div className="mb-10 prose prose-zinc">
      <h2 className="mb-2">{title}</h2>
      <p>{description}</p>
    </div>
  );
}
