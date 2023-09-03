import React from "react";
import Markdoc, { RenderableTreeNodes } from "@markdoc/markdoc";

function validURL(str: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

export type Components = {
  Image: ({ src, alt }: { src: string; alt?: string }) => JSX.Element;
  Callout: ({
    children,
    type,
  }: {
    children: React.ReactNode;
    type?: "caution" | "check" | "info" | "warning" | "docs" | "tada";
  }) => JSX.Element;
};

export const render = (
  transform: RenderableTreeNodes,
  imageBasePath: string,
  options?: { components?: Partial<Components> }
) => {
  const components: Components = {
    Image: ({ src, alt }: { src: string; alt?: string }) => {
      const imagePath = validURL(src)
        ? src
        : encodeURI(`${imageBasePath}&fn=${src}`);
      const CustomImage = options?.components?.Image;

      return CustomImage ? (
        <CustomImage src={imagePath} alt={alt} />
      ) : (
        <img
          src={imagePath}
          alt={alt}
          style={{ borderRadius: "12px" }}
          className="floe-image"
        />
      );
    },
    Callout: (props: {
      children: React.ReactNode;
      type?: "caution" | "check" | "info" | "warning" | "docs" | "tada";
    }) => {
      const icons = {
        caution: "⚠️",
        check: "✅",
        info: "ℹ️",
        warning: "⚠️",
        docs: "📖",
        tada: "🎉",
      };
      const CustomCallout = options?.components?.Callout;

      return CustomCallout ? (
        <CustomCallout {...props} />
      ) : (
        <div className="floe-callout">
          <div className="floe-callout-icon">{icons[props.type ?? "info"]}</div>
          <div className="floe-callout-text">{props.children}</div>
        </div>
      );
    },
  };

  return Markdoc.renderers.react(transform, React, {
    components,
  });
};
