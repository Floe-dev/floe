import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function Page() {
  return (
    <div className="px-4 prose prose-zinc sm:w-full sm:max-w-[360px] mx-auto pt-60 flex flex-col items-center">
      <CheckCircleIcon className="h-8" />
      <h3>Your GitHub App has been installed!</h3>
      <p>
        For security reasons your app will go through an additional approval
        step before it is activated with Floe. This usually takes less than 24
        hours.
      </p>
    </div>
  );
}
