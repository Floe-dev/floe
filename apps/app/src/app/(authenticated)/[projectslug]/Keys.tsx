"use client";

import { api } from "@/utils/trpc";
import { Card } from "@/components";
import { useProjectContext } from "@/context/project";
import { KeyTable } from "../KeyTable";
import { ApiKeysModal } from "../ApiKeysModal";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const Keys = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [publicKeyId, setPublicKeyId] = useState("");
  const { currentProject, queryKey } = useProjectContext();
  const { mutateAsync } = api.project.rollKey.useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const rollKey = async () => {
    if (
      confirm(
        "Are you sure you would like to rotate keys? This will invalidate your existing key."
      ) === true
    ) {
      const resp = await mutateAsync({
        projectId: currentProject!.id,
      });

      setPublicKeyId(resp.apiKeyId);
      setSecretKey(resp.token);
      setOpen(true);
    }
  };

  return (
    <div className="mt-4">
      <Card
        title="API key"
        subtitle="API keys allow you to authenticate with the API."
        actions={[
          {
            text: "Rotate key",
            onClick: rollKey,
            variant: "outline",
          },
        ]}
      >
        <KeyTable
          apiKeyId={
            currentProject?.apiKeyId ? currentProject?.apiKeyId : "No value set"
          }
          secretKey={
            currentProject?.encryptedApiKey
              ? "secret_••••••••••••••••••••••••••••••••••••"
              : "No value set"
          }
        />
      </Card>
      <ApiKeysModal
        open={open}
        setOpen={setOpen}
        publicKeyId={publicKeyId}
        secretKey={secretKey}
      />
    </div>
  );
};

export default Keys;
