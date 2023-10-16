import { DataSource } from "@floe/db";
import { api } from "@/utils/trpc";
import { Pill } from "@/components";

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

  if (isLoading) {
    return null;
  }

  if (!data) {
    return <Pill color="yellow" text="Not Configured" />;
  }

  return <Pill color="green" text="Configured" />;
};
