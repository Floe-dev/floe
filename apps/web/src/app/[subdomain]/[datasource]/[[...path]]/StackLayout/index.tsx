import SideNav from "./SideNav";

type Tree = (
  | {
      title: string;
      page: string;
    }
  | {
      title: string;
      pages: any[];
    }
)[];

interface StackLayoutProps {
  params: {
    subdomain: string;
    datasource: string;
    tab: string;
    path: string[];
  };
  tree: Tree;
  children: React.ReactNode;
}

export const StackLayout = ({ tree, params, children }: StackLayoutProps) => {
  return (
    <>
      <section className="relative hidden w-full md:w-60 shrink-0 md:block">
        <div className="relative inset-0 md:absolute">
          <div className="relative w-full md:fixed md:w-60">
            <SideNav tree={tree} params={params} />
          </div>
        </div>
      </section>
      <section className="w-full m-auto mt-12 md:mt-0 border-zinc-700">
        {children}
      </section>
    </>
  );
};
