import { createReview } from "@floe/requests/review/_post";

export async function getReviewsByFile(
  evalutationsByFile: {
    path: string;
    evaluations: {
      rule: {
        code: string;
        level: "error" | "warn";
        description: string;
      };
      hunk: {
        startLine: number;
        content: string;
      };
    }[];
  }[]
) {
  return Promise.all(
    evalutationsByFile.map(async ({ path, evaluations }) => {
      const evaluationsResponse = await Promise.all(
        evaluations.map(async ({ rule, hunk }) => {
          const review = await createReview({
            path,
            content: hunk.content,
            startLine: hunk.startLine,
            rule,
          });

          return {
            review: {
              ...review.data,
              // Map rule to each violation. This is useful later on for logging
              violations: review.data?.violations.map((v) => ({
                ...v,
                ...rule,
              })),
            },
            cached: review.data?.cached,
          };
        })
      );

      return {
        path,
        evaluationsResponse,
      };
    })
  );
}
