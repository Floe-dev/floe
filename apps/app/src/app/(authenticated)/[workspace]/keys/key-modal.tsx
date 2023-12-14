"use client";

import { useState, useTransition } from "react";
import type { Prisma } from "@floe/db";
import { Modal, Input, Button, Clipboard, Spinner } from "@floe/ui";
// @ts-expect-error -- Expected according to: https://github.com/vercel/next.js/issues/56041
import { useFormStatus } from "react-dom";
import { rollKey } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? <Spinner /> : "Create"}
    </Button>
  );
}

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
  const [newKey, setNewKey] = useState<string>();

  const handleFormSubmit = () => {
    try {
      startTransition(async () => {
        const key = await rollKey(name, workspace.id);
        setTimeout(() => {
          setNewKey(key);
        }, 300);
      });
    } catch (e) {
      // TODO: Add toast alert to handle error
      console.error(e);
    }
  };

  return (
    <>
      {/* Create key modal */}
      <Modal.Root open={open ? !newKey : false} setOpen={setOpen}>
        <form action={handleFormSubmit}>
          <Modal.Body
            subTitle="Give your key a descriptive name."
            title="Create key"
          >
            <Input
              label="Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="eg. CICD Key"
              value={name}
            />
          </Modal.Body>
          <Modal.Footer>
            <SubmitButton />
          </Modal.Footer>
        </form>
      </Modal.Root>

      {/* Copy key modal */}
      <Modal.Root open={open ? Boolean(newKey) : false} setOpen={setOpen}>
        <form
          action={() => {
            setOpen(false);
          }}
        >
          <Modal.Body
            subTitle="Save your key somewhere secure. You won't be able to see it again."
            title="Your new key"
          >
            <div className="flex justify-between p-4 rounded bg-zinc-200">
              <div className="font-mono text-sm text-zinc-600">{newKey}</div>
              <Clipboard text={newKey ?? ""} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Done</Button>
          </Modal.Footer>
        </form>
      </Modal.Root>
    </>
  );
}
