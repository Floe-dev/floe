export const exampleContent = {
  "1": "The Heisenberg uncertainty principle was formulated by Werner Heisenberg in 1927",
  "2": "HUP is one of the most famous results of quantum mechanics",
  "3": "The uncertainty principle states that certain pairs of physical properties, like position and momentum, cannot both be known to arbitrary precision",
  "4": "That is, the more presisely one property is known, the less precisely the other can be known",
};

export const exampleRules = [
  {
    code: "no-passive-voice",
    level: "warn",
    description: "Prefer active voice over passive voice.",
  },
  {
    code: "no-spelling-mistakes",
    level: "error",
    description: "Disallow any spelling mistakes",
  },
  {
    code: "no-acronyms",
    level: "warn",
    description: "Disallow acronyms",
  },
];

export const exampleOutput = {
  violations: [
    {
      code: "no-passive-voice",
      suggestion:
        "Consider rewording in active voice: 'Werner Heisenberg formulated the uncertainty principle in 1927.'",
      substring: "was formulated",
      line: 1,
    },
    {
      code: "no-spelling-mistakes",
      suggestion: "Fix spelling mistake: 'presisely' -> 'precisely'",
      substring: "presisely",
      line: 4,
    },
    {
      code: "no-acronyms",
      suggestion: "Do not use the acronym 'HUP'",
      substring: "HUP",
      line: 2,
    },
  ],
};
