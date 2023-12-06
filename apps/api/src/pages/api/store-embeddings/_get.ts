import { z } from "zod";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import type {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "~/types/private-middleware";
import { defaultResponder } from "~/lib/helpers/default-responder";

const querySchema = z.object({});

async function handler(
  { queryObj, workspace }: NextApiRequestExtension,
  res: NextApiResponseExtension
) {
  const parsed = querySchema.parse(queryObj);

  const pinecone = new Pinecone({
    environment: "northamerica-northeast1-gcp",
    apiKey: process.env.PINECONE_API_KEY!,
  });
  const index = pinecone.Index(process.env.PINCECONE_INDEX!);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const ns = index.namespace("my-first-namespace");
}

export default defaultResponder(handler);
