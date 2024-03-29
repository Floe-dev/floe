export const exampleContent = {
  "1": "These are my top 5 favourite movies of all time:",
  "2": "a. The Matrix",
  "3": "b. Babe: Pig in the City",
  "4": "c. Titanic",
};

export const exampleRule = {
  code: "no-lettered-lists",
  level: "warn",
  description: "Do not use lettered lists. Use numbered lists instead.",
};

export const exampleOutput = {
  violations: [
    {
      description: "A lettered list is used. Use a numbered list instead.",
      startLine: 2,
      textToReplace: "a. The Matrix\nb. Babe: Pig in the City\nc. Titanic",
      replaceTextWithFix: "1. The Matrix\n2. Babe: Pig in the City\n3. Titanic",
    },
  ],
};
