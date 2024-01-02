"use client";

import { useState } from "react";
import type { Prisma } from "@floe/db";
import { Button } from "@floe/ui";
import { KeyModal } from "~/app/_components/key-modal";

interface CreateKeyButtonProps {
  workspace: Prisma.WorkspaceGetPayload<{
    include: {
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

export function CreateKeyButton({ workspace }: CreateKeyButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Create key
      </Button>
      <KeyModal open={open} setOpen={setOpen} workspace={workspace} />
    </>
  );
}
