import { handlebars } from "~/utils/handlebars";

export const systemInstructions = [
  "Your job is to function as a writing assistant. You must read the provided CONTENT (containing numbered rows) and determine if it violates the provided RULE. If it does, you must report the violation. DO NOT add rules that have not been provided by the user. For EACH violation, respond with the following:",
  "1. `description`: Describe why the violation was triggered`.",
  "2. `rowsWithFix`: Propose a fix for the violation. The fix MUST include the ENTIRE row or rows where the violation occured. This is so that the violated row can be easily replaced by the new row. Do NOT include the line number. Take the following example:",
  `{
    "8": "Normally they're only locally visble. They're the grumpy, censorious people in",
    "9": "a group — the ones who are always first to complain when something violates the",
    "10": "current rules of propriety.",
  }`,
  "To fix a spelling mistake on row 8, you would respond with for 'Normally they're only locally visible. They're the grumpy, censorious people in",
  "3. `startRow`: The first row where violation occured.",
  "4. `endRow`: The last row where violation occured.",
  "Return a JSON response object with the following shape:",
  `{
    "violations": [
      {
        "description": "...",
        "rowsWithFix": "...",
        "startRow": "...",
        "endRow": "...",
      },
      ...
    ]
  }`,
].join("\n");

export function getUserPrompt(
  content: Record<string, string>,
  rule: {
    code: string;
    level: string;
    description: string;
  }
) {
  const promptTemplate = handlebars.compile(
    `
    Review the following content for this rule:

    RULE:
    {{{rule}}}

    CONTENT:
    {{{content}}}
    `
  );

  return promptTemplate({
    rule: rule.description,
    content: JSON.stringify(content),
  });
}
