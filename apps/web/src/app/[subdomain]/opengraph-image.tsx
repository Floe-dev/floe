import { getFloeClient } from "@/app/floe-client";
import { ImageResponse } from "next/server";

export const runtime = "edge";

export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { subdomain: string; tab: string };
}) {
  const floeClient = getFloeClient(params.subdomain);
  const project = await floeClient.project.get();

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* {post.title} */}
        <img
          width="256"
          height="256"
          src={project.logo}
          style={{
            borderRadius: 128,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
