"use client";
import { useState } from "react";
import { Card } from "@floe/ui";
import type { Prisma } from "@floe/db";
import { KeyModal } from "./key-modal";
import { Table } from "./table";

interface KeyProps {
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

function Keys({ workspace }: KeyProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <Card
        actions={[
          {
            text: "New key",
            onClick: () => {
              setOpen(true);
            },
          },
        ]}
        subtitle="API keys allow you to authenticate with the API."
        title="API keys"
      >
        <Table workspace={workspace} />
        <KeyModal open={open} setOpen={setOpen} workspace={workspace} />
      </Card>
    </div>
  );
}

export default Keys;
