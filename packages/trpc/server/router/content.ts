import { z } from "zod";
import OpenAI from "openai";
import { protectedTokenProcedure, router } from "../trpc";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const contentRouter = router({
  generate: protectedTokenProcedure
    .input(
      z.object({
        diff: z.string(),
        template: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an assistant to a software developer. You help them to generate a markdown file from a git diff.",
            },
            {
              role: "user",
              content: `
                Generate a markdown file from the following git diff: ${input.diff}
                \n\n
                Example: ${input.template}`,
            },
          ],
        });

        console.log(333333, response.choices[0]);

        return response.choices[0];
      } catch (error) {
        console.log(444444, error);
        return "yodo :(";
      }
    }),
});
