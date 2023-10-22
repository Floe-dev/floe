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
      console.log(111111);

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You generate markdown content based on a git diff and an example. Mimic the example as closely as possible.",
            },
            { role: "user", content: `diff: ${input.diff}` },
            { role: "user", content: `example: ${input.template}` },
          ],
        });

        console.log(333333, response.choices[0]);

        return response;
      } catch (error) {
        console.log(444444, error);
        return "yodo :(";
      }
    }),
});
