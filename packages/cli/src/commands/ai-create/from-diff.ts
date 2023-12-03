/* eslint-disable no-console -- Need for user output*/
import fs from "node:fs";
import path from "node:path";
import type { Command } from "commander";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { api } from "../../utils/api";
import { checkIfValidRoot } from "../../utils/check-if-valid-root";
import {
  getDefaultBranch,
  gitGithubOrGitlabOrgAndRepo,
  getCurrentBranch,
} from "../../utils/git";

const oraImport = import("ora").then((m) => m.default);

export function fromDiff(program: Command) {
  program
    .command("from-diff")
    .description("Generate content from diff")
    .requiredOption("--template <template>", "Template file")
    .option("--rulesets <rulesets...>", "Rulesets")
    .option("--owner <owner>", "Owner of the repository")
    .option("--repo <repo>", "Repository name")
    .option("--base <baseSha>", "Base SHA")
    .option("--head <headSha>", "Head SHA")
    .option("--outfile <outfile>", "Output file")
    .option("--outdir <outdir>", "Output directory")
    .option("--expressions <expressions>", "Expressions")
    .action(
      async (options: {
        template: string;
        rulesets?: string;
        owner?: string;
        repo?: string;
        base?: string;
        head?: string;
        outdir?: string;
        outfile?: string;
        expressions?: string;
      }) => {
        /**
         * Exit if not a valid Floe root
         */
        checkIfValidRoot();

        /**
         * Import ESM modules
         */
        const ora = await oraImport;

        const repoAndOwner = gitGithubOrGitlabOrgAndRepo();
        const baseSha = options.base || getDefaultBranch();
        const headSha = options.head || getCurrentBranch();
        const owner = options.owner || repoAndOwner?.owner;
        const repo = options.repo || repoAndOwner?.repo;
        const outDir = options.outdir;
        const outFile = options.outfile;
        const expressions = options.expressions
          ?.split(",")
          .reduce((config: Record<string, string>, pair: string) => {
            const [key, value] = pair.split("=");
            config[key] = value;
            return config;
          }, {});
        const templateFile = options.template;
        // const rulesetsDir = options.rulesets?.split(",") ?? [];

        if (!owner || !repo) {
          console.log(
            "Could not detect GitHub or GitLab remotes. Please connect a remote, or manually pass --owner and --repo."
          );
          process.exit(1);
        }

        const template = fs.readFileSync(
          path.join(
            process.cwd(),
            ".floe/templates/",

            templateFile
          ),
          "utf-8"
        );

        if (!template) {
          console.log(
            `Could not find template file ${templateFile}. Please create the file or pass a different template.`
          );
          process.exit(1);
        }

        /**
         * TODO: Add rulesets
         */

        try {
          const spinner = ora("Generating content...").start();

          const response = await api.get("/api/v1/ai-create-from-diff", {
            params: {
              owner,
              repo,
              baseSha,
              headSha,
              template,
              rulesets: [],
              expressions,
            },
          });

          spinner.succeed("Generated");

          /**
           * The user would like to write to a file
           */
          if (outDir || outFile) {
            const outDirPath = path.join(process.cwd(), outDir || "");
            const outFilePath = path.join(
              outDirPath,
              outFile ||
                `generated-${uniqueNamesGenerator({
                  separator: "-",
                  dictionaries: [adjectives, colors, animals],
                })}.md`
            );

            fs.mkdirSync(outDirPath, { recursive: true });
            fs.writeFileSync(
              outFilePath,
              response.data.response.choices[0].message.content as string
            );

            console.log(
              `✔ File written to ${path.relative(process.cwd(), outFilePath)}`
            );

            return;
          }

          console.log(response.data.response.choices[0].message.content);
          return response.data.response;
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      }
    );
}
