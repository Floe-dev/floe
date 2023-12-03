"use client";

import { useState, useTransition } from "react";
import type { Prisma } from "@floe/db";
import { Modal, Input, Button } from "@floe/ui";
import { rollKey } from "./actions";

export function KeyModal({
  open,
  setOpen,
  workspace,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
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
}) {
  const [_, startTransition] = useTransition();
  const [name, setName] = useState("");

  const handleFormSubmit = () => {
    try {
      startTransition(async () => {
        const key = await rollKey(name, workspace.id);
        setOpen(false);
        alert(key);
      });
    } catch (e) {
      // TODO: Add toast alert to handle error
      console.error(e);
    }
  };

  return (
    <Modal.Root open={open} setOpen={setOpen}>
      <form action={handleFormSubmit}>
        <Modal.Body
          subTitle="Save your keys somewhere secure. You will only be able to view the secret once."
          title="API Keys"
        >
          <Input
            label="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Continue</Button>
        </Modal.Footer>
      </form>
    </Modal.Root>
  );
}
