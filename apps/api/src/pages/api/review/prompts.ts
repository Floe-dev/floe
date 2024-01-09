import { handlebars } from "~/utils/handlebars";

// export const systemInstructions = [
//   "Your job is to function as a prose linter. You will be given CONTENT (an object where keys represent lineNumbers, and values represent content) and RULES (a dictionary). For every rule:",
//   "1. Determine places where the rule is violated. You must only report on supplied rules. DO NOT add rules that have not been provided by the user.",
//   "2. Describe why the violation was triggered in `description`.",
//   "3. Suggest a fix, `suggestedFix`, for the violated lines. The fix MUST be a drop-in replacement for the violated lines. For example, if line 3 has multiple sentences, you cannot suggest a fix that only replaces the first sentence. If the violation spans multiple lines, insert a newline character '\\n' between each line. If no fix is available, you can return 'undefined'.",
//   "4. Report the `startLine` and `endLine` numbers in which the violation occured.",
//   "Return a JSON response object with the following shape:",
//   `{
//     "violations": [
//       {
//         "description": "...",
//         "suggestedFix": "...",
//         "startLine": "...",
//         "endLine": "...",
//       },
//       ...
//     ]
//   }`,
// ].join("\n");

export const systemInstructions = `You are a text editor. You will receive a DOCUMENT and RULES. The DOCUMENT includes the line number in square braces. For example:
[lineNumber] ...some line content

You must find RULE violations in the DOCUMENT. Return a JSON object with the following shape:
{
  "violations": [
    {
      "startLine": "...",
      "endLine": "...",
      "description": "...",
      "suggestedFix": "...",
    },
    ...
  ]
}

- "startLine": The lineNumber where the violation starts.
- "endLine": The lineNumber where the violation ends.
- "description": Describe why the violation was triggered.
- "suggestedFix": Replace the violated line(s) with this value. This MUST be a replacement for the ENTIRE line. If no fix is available, you can return 'undefined'.
`;

export function getUserPrompt(
  content: string,
  rule: {
    code: string;
    level: string;
    description: string;
  }
) {
  const promptTemplate = handlebars.compile(
    `
    Please lint the following content based on the following rule:

    RULES:
    {{{rule}}}

    DOCUMENT:
    {{{content}}}`
  );

  return promptTemplate({
    rule: rule.description,
    content: JSON.stringify(content),
  });
}
