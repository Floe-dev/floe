"use client";

import React, { useState } from "react";
import { Input, Button } from "@floe/ui";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import cn from "classnames";

interface SubscribeProps {
  className?: string;
}

type FormData = {
  email: string;
};

const subscribeSchema = yup
  .object({
    email: yup
      .string()
      .email("Must be a valid email.")
      .required("An email address is required."),
  })
  .required();

const Subscribe = ({ className }: SubscribeProps) => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    resolver: yupResolver(subscribeSchema),
  });
  const onSubmit = handleSubmit(async (data: FormData) => {
    const { email } = data;

    setIsLoading(true);

    const res = await fetch("/api/subscribe", {
      body: JSON.stringify({
        email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();

    setIsLoading(false);

    if (error) {
      setMessage(error);

      return;
    }

    setMessage("Success! You are now subscribed.");
    reset();
  });

  return (
    <form onSubmit={onSubmit} className={cn("flex items-start gap-2", { [className]: className })}>
      <Input
        icon={EnvelopeIcon}
        placeholder="Email address"
        subtext={message || "Get notified about new updates."}
        errortext={errors.email?.message}
        {...register("email", {
          required: true,
          onChange: () => setMessage(null),
        })}
        disabled={isLoading}
      />
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Notify me"}
      </Button>
    </form>
  );
};

export default Subscribe;
