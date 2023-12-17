import { handlebars } from "~/utils/handlebars";

export const systemInstructions = [
  "Your job is to function as a prose linter. You will be given CONTENT (an object where keys represent lineNumbers, and values represent content) and RULES (a dictionary). For every rule:",
  "1. Determine places where the rule is violated. You must only report on supplied rules. DO NOT add rules that have not been provided by the user.",
  "2. Report the `code` of the rule.",
  "3. Describe why the violation was triggered in `errorDescription`.",
  "4. Suggest a `fix` for the violated lines. If the violation spans multiple lines, insert a newline character '\\n' between each line. If no fix is available, you can return 'undefined'.",
  "5. Report the `startLine` and `endLine` numbers in which the violation occured.",
  "Return a JSON response object with the following shape:",
  `{
    "violations": [
      {
        "code": "...",
        "errorDescription": "...",
        "fix": "...",
        "startLine": "...",
        "endLine": "...",
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
