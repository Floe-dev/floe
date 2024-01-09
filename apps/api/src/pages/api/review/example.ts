export const exampleContent = {
  "1": "It's much the same as if you committed a crime. No matter how virtuously you've",
  "2": "lived, if you commit a crime, you must still sufer the penalty of the law.",
  "3": "Having lived a previously blameless life might mitigate the punishment, but it",
  "4": "doesn't affect whether you're guilty or not.",
};

export const exampleRule = {
  code: "spelling-mistakes",
  level: "warn",
  description: "No spelling mistakes.",
};

export const exampleOutput = {
  violations: [
    {
      description: "The word 'suffer' was misspelled.",
      stringToReplace:
        "lived, if you commit a crime, you must still suffer the penalty of the law.",
      startRow: 2,
      endRow: 2,
    },
  ],
};
