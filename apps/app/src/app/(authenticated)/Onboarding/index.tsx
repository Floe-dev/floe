import { Button } from "@/components";
import { useSession } from "next-auth/react";

const Onboarding = () => {
  const { data } = useSession();

  const getUserName = () => {
    if (!data?.user.name) {
      return "there";
    }

    return data.user.name.split(" ")[0];
  };

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="max-w-[480px] prose">
        <h1>👋</h1>
        <p>Hey {getUserName()},</p>
        <p>
          I&apos;m Nic, the founder of Floe. Welcome, and thank you for trying
          out the platform!
        </p>
        <p>
          I&apos;m working on Floe for one simple reason:{" "}
          <strong>product releases are hard</strong>.
        </p>
        <p>
          While the platform is still in the early stages, I hope you get a
          sense of where the project is going, and that it makes your releases
          just a little bit easier.
        </p>
        <p>To get started, install the GitHub app.</p>
        <a
          href={`https://github.com/apps/${
            process.env.NEXT_PUBLIC_APP_NAME ?? "floe-app"
          }/installations/select_target`}
        >
          <Button className="justify-center w-full mt-4 mb-2">
            Install Floe
          </Button>
        </a>
        <p className="my-2 text-xs text-gray-500">
          • Floe will <em>never</em> store code you give it access to
        </p>
        <p className="my-2 text-xs text-gray-500">
          • Floe only reads code from the{" "}
          <span className="font-mono">/.floe</span> directory
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
