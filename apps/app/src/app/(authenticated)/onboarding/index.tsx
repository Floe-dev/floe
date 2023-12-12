import { CreateOrg } from "./create-org";

export function Onboarding(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center pt-32">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[360px] prose prose-zinc">
        <CreateOrg />
      </div>
    </div>
  );
}
