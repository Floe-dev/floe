/* eslint-disable no-param-reassign -- TODO: refactor */
import handlebars from "handlebars";

handlebars.registerHelper("ai", (text: string) => {
  return `{{${text}}}`;
});

function getVariablesFromStatementsRecursive(statements) {
  return statements.reduce((acc: string[], statement) => {
    const { type } = statement;

    if (type === "BlockStatement") {
      const { inverse, program } = statement;

      if (program?.body) {
        acc = acc.concat(
          getVariablesFromStatementsRecursive(program.body) as string
        );
      }

      if (inverse?.body) {
        acc = acc.concat(
          getVariablesFromStatementsRecursive(inverse.body) as string
        );
      }
    } else if (type === "MustacheStatement") {
      const { path } = statement;

      if (path?.original) {
        acc.push(path.original as string);
      }
    }

    return acc;
  }, []);
}

export function getHandlebarsVariables(input: string) {
  const ast = handlebars.parseWithoutProcessing(input);

  const rawVariables = getVariablesFromStatementsRecursive(ast.body);

  // Remove duplicates and "ai"
  return rawVariables.filter(
    (variable: string, index: number) =>
      rawVariables.indexOf(variable) === index && variable !== "ai"
  );
}

export { handlebars };
