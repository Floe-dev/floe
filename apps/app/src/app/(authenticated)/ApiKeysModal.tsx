"use client";

import { Modal } from "@/components/Modal";
import { KeyTable } from "./KeyTable";
import { useProjectContext } from "@/context/project";

export const ApiKeysModal = ({
  open,
  setOpen,
  secretKey,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  secretKey: string;
}) => {
  const { currentProject } = useProjectContext();

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="API Keys"
      subTitle="Save your keys somewhere secure. You will only be able to view the secret once."
      actions={[
        {
          text: "Continue",
          type: "submit",
          variant: "outline",
          onClick: () => setOpen(false),
        },
      ]}
      content={
        <form
          className="flex flex-col items-start gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <KeyTable
            slug={currentProject?.slug ?? "No value set"}
            secretKey={secretKey}
            hideAccessCol
            secretKeyCopiable
          />
        </form>
      }
    />
  );
};
