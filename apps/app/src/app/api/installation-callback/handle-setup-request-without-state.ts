import { redirect } from "next/navigation";

export function handleSetupRequestWithoutState() {
  redirect("/installation/requested");
}
