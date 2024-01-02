import { Header } from "~/app/_components/header";
import { getWorkspace } from "~/lib/features/workspace";
import Keys from "./keys";

export default async function Developers({
  params,
}: {
  params: { workspace: string };
}) {
  const workspace = await getWorkspace(params.workspace);

  if (!workspace) {
    return null;
  }

  return (
    <div className="max-w-screen-lg">
      <Header
        description="Settings used to manage developer tooling."
        title="Developers"
      />
      <div>
        <Keys workspace={workspace} />
      </div>
    </div>
  );
}
