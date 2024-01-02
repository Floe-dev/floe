import { getServerSession } from "next-auth";
import Link from "next/link";
import { db } from "@floe/db";
import {
  MapIcon,
  BookOpenIcon,
  MegaphoneIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { Button, Ping } from "@floe/ui";
import { authOptions } from "~/server/auth";
import { Header } from "~/app/_components/header";
import { GitHubButton } from "./integrations/github-button";

async function getWorkspace(workspaceSlug: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return db.workspace.findUnique({
    where: {
      slug: workspaceSlug,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      githubIntegration: true,
      gitlabIntegration: true,
      encrytpedKeys: {
        select: {
          name: true,
          slug: true,
          createdAt: true,
        },
      },
    },
  });
}

export default async function Workspace({
  params,
}: {
  params: { workspace: string };
}) {
  const workspace = await getWorkspace(params.workspace);

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <div className="max-w-screen-lg">
      <Header description={`Your ${workspace.name} dashboard.`} title="Home" />
      {/* Next steps */}
      <div className="flex flex-col gap-8 ">
        <div>
          <h3 className="flex items-center gap-2 mb-2 text-sm font-medium text-zinc-500">
            <Ping />
            <span>Next steps</span>
          </h3>
          <div className="px-6 bg-white shadow rounded-xl">
            <div className="flex flex-col divide-y">
              <div className="flex items-start justify-between py-6">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 m-0 rounded-full bg-amber-100 text-amber-800">
                    1
                  </div>
                  <div className="prose prose-zinc">
                    <h4 className="my-0 mt-1 text-base font-semibold leading-6 text-zinc-900">
                      Create a key
                    </h4>
                    <p className="mt-2 text-sm text-zinc-500">
                      Generate an API key and store it somewhere safe.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <GitHubButton workspace={workspace} />
                </div>
              </div>
              <div className="flex items-start justify-between py-6">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 m-0 rounded-full bg-amber-100 text-amber-800">
                    2
                  </div>
                  <div className="prose prose-zinc">
                    <h4 className="my-0 mt-1 text-base font-semibold leading-6 text-zinc-900">
                      Connect to GitHub
                    </h4>
                    <p className="mt-2 text-sm text-zinc-500">
                      Generate an API key and store it somewhere safe.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <GitHubButton workspace={workspace} />
                </div>
              </div>
              <div className="flex items-start justify-between py-6">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 m-0 rounded-full bg-amber-100 text-amber-800">
                    3
                  </div>
                  <div className="prose prose-zinc">
                    <h4 className="my-0 mt-1 text-base font-semibold leading-6 text-zinc-900">
                      Initialize
                    </h4>
                    <p className="mt-2 text-sm text-zinc-500">
                      Install the CLI and initialize Floe.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <GitHubButton workspace={workspace} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <h3 className="mb-2 text-sm font-medium text-zinc-500">
            Links and resources
          </h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* DOCS */}
            <Link
              className="group"
              href="https://docs.floe.dev"
              target="_blank"
            >
              <div className="flex duration-200 rounded shadow-sm group-hover:opacity-80">
                <div className="flex items-center justify-center w-16 h-16 bg-green-200 rounded-l-md">
                  <BookOpenIcon className="w-6 h-6 text-green-700 duration-200 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-between flex-1 pl-4 pr-3 truncate bg-white border-t border-b border-r border-zinc-200 rounded-r-md">
                  <div className="">
                    <h6 className="text-base font-semibold text-zinc-900">
                      Docs
                    </h6>
                    <p className="text-sm text-zinc-500">
                      Learn how to get setup with Floe.
                    </p>
                  </div>
                  <ChevronRightIcon className="flex-shrink-0 w-5 h-5 duration-200 text-zinc-500 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* SLACK */}
            <Link
              className="group"
              href="https://join.slack.com/t/floedev/shared_invite/zt-1okoncyuu-_v9KaY7AjEQfKNj6O6qvVg"
              target="_blank"
            >
              <div className="flex duration-200 rounded shadow-sm group-hover:opacity-80">
                <div className="flex items-center justify-center w-16 h-16 bg-yellow-200 rounded-l-md">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-yellow-700 duration-200 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-between flex-1 pl-4 pr-3 truncate bg-white border-t border-b border-r border-zinc-200 rounded-r-md">
                  <div className="">
                    <h6 className="text-base font-semibold text-zinc-900">
                      Community
                    </h6>
                    <p className="text-sm text-zinc-500">
                      Join our Slack channel.
                    </p>
                  </div>
                  <ChevronRightIcon className="flex-shrink-0 w-5 h-5 duration-200 text-zinc-500 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* CANNY ROADMAP */}
            <Link
              className="group"
              href="https://floe.canny.io/"
              target="_blank"
            >
              <div className="flex duration-200 rounded shadow-sm group-hover:opacity-80">
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-200 rounded-l-md">
                  <MapIcon className="w-6 h-6 text-indigo-700 duration-200 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-between flex-1 pl-4 pr-3 truncate bg-white border-t border-b border-r border-zinc-200 rounded-r-md">
                  <div className="">
                    <h6 className="text-base font-semibold text-zinc-900">
                      Roadmap
                    </h6>
                    <p className="text-sm text-zinc-500">
                      See where Floe is headed.
                    </p>
                  </div>
                  <ChevronRightIcon className="flex-shrink-0 w-5 h-5 duration-200 text-zinc-500 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* CANNY ROADMAP */}
            <Link
              className="group"
              href="https://floe.canny.io/feature-requests"
              target="_blank"
            >
              <div className="flex duration-200 rounded shadow-sm group-hover:opacity-80">
                <div className="flex items-center justify-center w-16 h-16 bg-pink-200 rounded-l-md">
                  <MegaphoneIcon className="w-6 h-6 text-pink-700 duration-200 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-between flex-1 pl-4 pr-3 truncate bg-white border-t border-b border-r border-zinc-200 rounded-r-md">
                  <div className="">
                    <h6 className="text-base font-semibold text-zinc-900">
                      Feature requests
                    </h6>
                    <p className="text-sm text-zinc-500">
                      What should we build next?
                    </p>
                  </div>
                  <ChevronRightIcon className="flex-shrink-0 w-5 h-5 duration-200 text-zinc-500 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
