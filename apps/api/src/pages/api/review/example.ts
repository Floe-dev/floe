export const examples = [
  // Example 1
  {
    rule: {
      code: "no-lettered-lists",
      level: "warn",
      description: "Do not use lettered lists. Use numbered lists instead.",
    },
    content: `[5] These are my top 5 favourite movies of all time:
      [6] a. The Matrix
      [7] b. Babe: Pig in the City
      [8] c. Titanic`,
    output: {
      violations: [
        {
          description: "A lettered list is used. Use a numbered list instead.",
          suggestedFix: "1. The Matrix\n2. Babe: Pig in the City\n3. Titanic",
          startLine: 6,
          endLine: 8,
        },
      ],
    },
  },

  // Example 2
  {
    rule: {
      code: "text-style",
      level: "warn",
      description: "Write in British-style english, not American-style.",
    },
    content: `[1] Once you publish something, the convention is that whatever you wrote was what
    [2] you thought before you wrote it. Thse were your ideas, and now you've expressed
    [3] them. But you know this isn't true. You know that putting your ideas into words
    [4] changed them. And not just the ideas you publishd. Presumably there were others
    [5] that turned out to be too broken to fix, and those you discarded instead.`,
    output: {
      violations: [
        {
          description: "The word 'published' is mispelled.",
          suggestedFix:
            "changed them. And not just the ideas you published. Presumably there were others",
          startLine: 5,
          endLine: 5,
        },
      ],
    },
  },
];
