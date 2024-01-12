import { handlebars } from "~/utils/handlebars";

export const systemInstructions = [
  "Your job is to function as a writing assistant. You will be given CONTENT (an object where keys represent lineNumbers, and values represent content) and RULES (a dictionary). For every rule:",
  "1. Determine places where the rule is violated. You must only report on supplied rules. DO NOT add rules that have not been provided by the user.",
  "2. Describe why the violation was triggered in `description`.",
  "3. Report the `textToReplace` that should be replaced with the fix.",
  "4. Suggest a fix for the violation in `replaceTextWithFix`.",
  "5. Report the line number where the violation was triggered in `startLine`. This is the 'key' at the start of the line.",
  "Return a JSON response object with the following shape:",
  `{
    "violations": [
      {
        "description": "...",
        "startLine: "...",
        "textToReplace: "...",
        "replaceTextWithFix": "...",
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
    Please lint the following content based on the following rule:

    RULE:
    {{{rule}}}

    CONTENT:
    {{{content}}}`
  );

  return promptTemplate({
    rule: rule.description,
    content: JSON.stringify(content),
  });
}
