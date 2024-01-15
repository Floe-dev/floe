import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function Page() {
  return (
    <div className="px-4 prose prose-zinc sm:w-full sm:max-w-[360px] mx-auto pt-60 flex flex-col items-center text-center">
      <CheckCircleIcon className="h-8" />
      <p>Your installation request has been sent to your organization admin.</p>
    </div>
  );
}
