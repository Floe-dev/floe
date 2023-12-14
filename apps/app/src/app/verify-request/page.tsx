import { SparklesIcon } from "@heroicons/react/24/solid";

export default function Page() {
  return (
    <div className="px-4 prose prose-zinc sm:w-full sm:max-w-[360px] mx-auto pt-60 flex flex-col items-center">
      <SparklesIcon className="h-8" />
      <p>A magic link has been sent to your email.</p>
    </div>
  );
}
