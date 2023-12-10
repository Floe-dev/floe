export const exampleContent = {
  "1": "These are my top 5 favourite moveies of all time:",
  "2": "a. The Matrix",
  "3": "b. Babe: Pig in the City",
  "4": "c. Titanic",
};

export const exampleRules = [
  {
    code: "no-spelling-mistakes",
    level: "error",
    description: "Disallow any spelling mistakes",
  },
  {
    code: "no-lettered-lists",
    level: "warn",
    description: "Do not use lettered lists. Use numbered lists instead.",
  },
];

export const exampleOutput = {
  violations: [
    {
      code: "no-passive-voice",
      suggestion:
        "Consider rewording in active voice: 'Werner Heisenberg formulated the uncertainty principle in 1927.'",
      substring: "was formulated",
      startLine: 1,
      endLine: 1,
    },
    {
      code: "no-spelling-mistakes",
      suggestion: "Fix spelling mistake: 'presisely' -> 'precisely'",
      substring: "presisely",
      startLine: 4,
      endLine: 4,
    },
    {
      code: "no-acronyms",
      suggestion: "Do not use the acronym 'HUP'",
      substring: "HUP",
      startLine: 2,
      endLine: 2,
    },
  ],
};
