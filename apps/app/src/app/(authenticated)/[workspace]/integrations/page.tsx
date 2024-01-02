import { Button } from "@floe/ui";
import { Header } from "~/app/_components/header";
import { getWorkspace } from "~/lib/features/workspace";
import { GitHubButton } from "./github-button";

export default async function Integrations({
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
        description="Extend Floe's capabilties with 3rd party integrations."
        title="Integrations"
      />
      <div>
        <h3 className="mb-2 text-sm font-medium text-zinc-500">
          Git providers
        </h3>
        <div className="px-6 bg-white shadow rounded-xl ">
          <div className="flex flex-col divide-y">
            <div className="flex items-start justify-between py-6">
              <div className="prose prose-zinc">
                <h4 className="my-0 text-base font-semibold leading-6 text-zinc-900">
                  GitHub
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  Install the Floe GitHub app to enable code reviews and more.
                </p>
              </div>
              <div className="text-right">
                <GitHubButton workspace={workspace} />
              </div>
            </div>
            <div className="flex items-start justify-between py-6">
              <div className="prose prose-zinc">
                <h4 className="my-0 text-base font-semibold leading-6 text-zinc-900">
                  GitLab
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  This integration is not yet available.
                </p>
              </div>
              <div className="text-right">
                <Button color="gray" disabled>
                  Link account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
