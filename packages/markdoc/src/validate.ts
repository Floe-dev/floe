import Markdoc from "@markdoc/markdoc";
import { markdocConfig } from "./config";

export const validate = (doc: string) => {
  const ast = Markdoc.parse(doc);

  return Markdoc.validate(ast, markdocConfig);
};
