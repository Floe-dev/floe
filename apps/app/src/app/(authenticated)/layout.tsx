"use client";

import DashboardLayout from "./DashboardLayout";
import {
  InstallationsProvider,
  useInstallationsContext,
} from "@/context/installations";
import { ProjectProvider } from "@/context/project";
import Onboarding from "./Onboarding";
import { Spinner } from "@/components";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "TokenExpired") {
      signOut();
    }
  }, [session?.error]);

  /**
   * Display spinner while signing out
   */
  if (session?.error === "TokenExpired") {
    return (
      <div className="grid h-full place-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <InstallationsProvider>
      <AuthenticatedLayoutChildren>{children}</AuthenticatedLayoutChildren>
    </InstallationsProvider>
  );
}

const AuthenticatedLayoutChildren = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { installations, isLoading } = useInstallationsContext();

  if (isLoading) {
    return (
      <div className="grid h-full place-items-center">
        <Spinner />
      </div>
    );
  }

  if (!installations?.length) {
    return <Onboarding />;
  }

  return (
    <ProjectProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ProjectProvider>
  );
};
