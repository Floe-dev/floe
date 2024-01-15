import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function Page() {
  return (
    <div className="px-4 prose prose-zinc sm:w-full sm:max-w-[360px] mx-auto pt-60 flex flex-col items-center text-center">
      <CheckCircleIcon className="h-8" />
      <p>
        Please contact us at{" "}
        <a href="mailto:contact@floe.dev?subject=Finalize installation">
          contact@floe.dev
        </a>{" "}
        to finalize your installation. Additionally, please include the
        following information:
      </p>
      <ul className="p-0 mt-0">
        <li>Your Floe Workspace name</li>
        <li>Your GitHub Org name</li>
      </ul>
    </div>
  );
}
