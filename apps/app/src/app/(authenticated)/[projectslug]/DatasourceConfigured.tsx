import { DataSource } from "@floe/db";
import { api } from "@floe/trpc/react";
import { Pill, HoverCard } from "@/components";

interface DatasourceConfiguredProps {
  datasource: DataSource;
}

export const DatasourceConfigured = ({
  datasource,
}: DatasourceConfiguredProps) => {
  const { owner, repo: repository, baseBranch: branch } = datasource;
  const { data, isLoading } = api.github.getConfig.useQuery({
    owner,
    repository,
    branch,
  });

  console.log(11111, data);

  if (isLoading) {
    return null;
  }

  if (!data) {
    return (
      <HoverCard
        content={
          <div className="text-sm prose">
            <p>
              A Floe configuration file was not found in the{" "}
              <span className="font-mono font-semibold">
                {owner}/{repository}
              </span>{" "}
              repository on the{" "}
              <span className="font-mono font-semibold">{branch}</span> branch.
              To add a Floe configuration:
            </p>
            <p>1. Navigate to the root of your repository.</p>
            <p>2. Run the following command:</p>
            <pre className="">
              <code>npx @floe/cli@latest init</code>
            </pre>
            <p>
              3. Deploy to your{" "}
              <span className="font-mono font-semibold">{branch}</span> branch.
            </p>
          </div>
        }
      >
        <div className="cursor-pointer">
          <Pill color="yellow" text="Not Configured" />
        </div>
      </HoverCard>
    );
  }

  return (
    <HoverCard
      content={
        <p className="text-sm prose">Floe is configured and ready to go 🎉</p>
      }
    >
      <div className="cursor-pointer">
        <Pill color="green" text="Configured" />
      </div>
    </HoverCard>
  );
};
