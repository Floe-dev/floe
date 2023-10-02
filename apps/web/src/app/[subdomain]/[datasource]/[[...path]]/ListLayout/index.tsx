interface ListLayoutProps {
  children: React.ReactNode;
}

export const ListLayout = ({ children }: ListLayoutProps) => (
  <div className="flex flex-col flex-1 gap-24">{children}</div>
);
