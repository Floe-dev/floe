import { protectedTokenProcedure, router } from "../trpc";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const contentRouter = router({
  generate: protectedTokenProcedure.query(async ({}) => {
    console.log(111111);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Who won the world series in 2020?" },
          {
            role: "assistant",
            content: "The Los Angeles Dodgers won the World Series in 2020.",
          },
          { role: "user", content: "Where was it played?" },
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
