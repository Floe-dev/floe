import { useProjectContext } from "@/context/project";
import { Button } from "@floe/ui";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

export const ProjectInfo = () => {
  const { currentProject } = useProjectContext();

  if (!currentProject) {
    return;
  }

  const siteLink =
    process.env.NODE_ENV === "production"
      ? `https://${currentProject.slug}.floe.dev`
      : `http://localhost:3000/${currentProject.slug}`;

  return (
    <div className="flex justify-between">
      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-4">
          {currentProject.favicon && (
            <div
              className={`flex items-center justify-center object-cover w-10 h-10 bg-white rounded-lg shadow-sm shrink-0 ring-1 ring-gray-900/10`}
            >
              <Image
                src={currentProject.favicon}
                alt={currentProject.name}
                width="0"
                height="0"
                sizes="100vw"
                className="w-auto h-8"
              />
            </div>
          )}
          <h2 className="text-4xl font-medium leading-6 text-zinc-700">
            {currentProject.name}{" "}
          </h2>
        </div>
        {currentProject.description && (
          <p className="my-3 text-lg text-gray-500">
            {currentProject.description}
          </p>
        )}
      </div>
      <Link
        href={`${siteLink}/${currentProject.datasources[0].slug}`}
        target="_blank"
      >
        <Button className="self-start" variant="outline">
          <span>View Site</span>
          <ArrowUpRightIcon className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};
