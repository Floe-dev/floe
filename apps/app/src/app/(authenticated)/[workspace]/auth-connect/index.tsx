"use client";

import { Button, Modal, Input } from "@floe/ui";
import type { Prisma } from "@floe/db";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { setGitlabToken } from "./actions";

interface AuthConnectProps {
  workspace: Prisma.WorkspaceGetPayload<{
    include: {
      githubIntegration: true;
      gitlabIntegration: true;
      encrytpedKeys: {
        select: {
          name: true;
          slug: true;
          createdAt: true;
        };
      };
    };
  }>;
}

/**
 * Component to allow a user to connect their org to either a GitHub or GitLab
 */
export async function AuthConnect({ workspace }: AuthConnectProps) {
  const [open, setOpen] = useState(false);
  const [_, startTransition] = useTransition();

  const session = await getSession();
  console.log(11111, session);

  const handleFormSubmit = (formData: FormData) => {
    try {
      startTransition(async () => {
        await setGitlabToken(workspace.id, formData);
        setOpen(false);
      });
    } catch (e) {
      // TODO: Add toast alert to handle error
      console.error(e);
    }
  };

  if (workspace.gitlabIntegration || workspace.githubIntegration) {
    return null;
  }

  return (
    <div>
      <Button onClick={() => signIn("github")}>Link GitHub Account</Button>
      <Link
        href={`https://github.com/apps/floe-app/installations/new?state=${workspace.slug}`}
      >
        <Button>Connect to GitHub</Button>
      </Link>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Connect to GitLab
      </Button>
      <Modal.Root open={open} setOpen={setOpen}>
        <form action={handleFormSubmit}>
          <Modal.Body title="Connect to GitLab">
            <Input
              label="API Access Token"
              name="token"
              subtext="You can create access tokens in your GitLab dashboard."
            />
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Connect</Button>
          </Modal.Footer>
        </form>
      </Modal.Root>
    </div>
  );
}
