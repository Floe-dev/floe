"use server";

import { z } from "zod";
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER,
});

const schema = z
  .object({
    email: z.string().email(),
  })
  .required();

export const subscribe = async (_, formData: FormData) => {
  const parsed = schema.parse({
    email: formData.get("email") as string,
  });

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: parsed.email,
      status: "subscribed",
    });

    return {
      message: "Email added successfully!",
    };
  } catch (e) {
    return {
      message: "Email could not be added.",
    };
  }
};
