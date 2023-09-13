import { Pill } from "@/components";
import { useProjectContext } from "@/context/project";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { PhotoIcon } from "@heroicons/react/24/solid";
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
    <div className="w-full mb-4 overflow-hidden bg-white rounded-lg shadow md:w-1/3">
      <div className="flex items-center p-6 bg-white border-b gap-x-4 border-gray-900/5">
        <div
          className={`flex items-center justify-center object-cover w-12 h-12 ${
            currentProject.favicon ? "bg-white" : "bg-gray-100"
          } rounded-lg shadow-sm shrink-0 ring-1 ring-gray-900/10`}
        >
          {currentProject.favicon ? (
            <Image
              src={currentProject.favicon}
              alt={currentProject.name}
              width="0"
              height="0"
              sizes="100vw"
              className="w-auto h-8"
            />
          ) : (
            <PhotoIcon className="w-6 h-6 text-zinc-400" />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 px-0">
            <h2 className="text-lg font-medium leading-6 capitalize text-zinc-700">
              {currentProject.name}{" "}
            </h2>
            <Pill text={currentProject.slug} color="gray" fontStlye="mono" />
          </div>
          <p className="my-1 text-sm text-gray-500">
            {currentProject.description || "No description added."}
          </p>
        </div>
      </div>
      <dl className="px-6 py-4 -my-3 text-sm leading-6 divide-y divide-gray-100">
        <div className="flex justify-between py-3 gap-x-4">
          <dt className="text-gray-500">Changelog</dt>
          <dd>
            <Link
              href={siteLink + "/changelog"}
              className="flex text-indigo-500"
              target="_blank"
            >
              Visit <ArrowUpRightIcon className="flex-shrink-0 w-5 h-5 ml-1" />
            </Link>
          </dd>
        </div>
        <div className="flex justify-between py-3 gap-x-4">
          <dt className="text-gray-500">Blog</dt>
          <dd className="flex items-start gap-x-2">
            <Link
              href={siteLink + "/blog"}
              className="flex text-indigo-500"
              target="_blank"
            >
              Visit <ArrowUpRightIcon className="flex-shrink-0 w-5 h-5 ml-1" />
            </Link>
          </dd>
        </div>
        <div className="flex justify-between py-3 gap-x-4">
          <dt className="text-gray-500">Docs</dt>
          <dd className="flex items-start text-gray-700 gap-x-2">
            <Link
              href={siteLink + "/docs"}
              className="flex text-indigo-500"
              target="_blank"
            >
              Visit <ArrowUpRightIcon className="flex-shrink-0 w-5 h-5 ml-1" />
            </Link>
          </dd>
        </div>
      </dl>
    </div>
  );
};
