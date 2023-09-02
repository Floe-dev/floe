import mailchimp from "@mailchimp/mailchimp_marketing";
import { NextResponse } from "next/server";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER,
});

export const POST = async (req: Request) => {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({
      status: 400,
      body: { error: "Email is required" },
    });
  }

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: "subscribed",
    });

    return NextResponse.json({
      status: 201,
      body: {
        error: "",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      body: {
        error: error.message || error.toString(),
      },
    });
  }
};
