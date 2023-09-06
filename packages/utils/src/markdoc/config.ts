import { Config } from "@markdoc/markdoc";

export const markdocConfig: Config = {
  variables: {},
  tags: {
    image: {
      render: "Image",
      children: [],
      attributes: {
        src: {
          type: String,
          required: true,
          errorLevel: "critical",
        },
        alt: {
          type: String,
        },
      },
      selfClosing: true,
    },
    callout: {
      render: "Callout",
      children: ["paragraph", "tag", "list"],
      attributes: {
        type: {
          type: String,
          default: "info",
          matches: ["caution", "check", "info", "warning", "docs", "tada"],
          errorLevel: "critical",
        },
      },
    },
  },
};