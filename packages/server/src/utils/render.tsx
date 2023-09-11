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

  CodeBlock: ({
    children,
    language,
  }: {
    children: React.ReactNode;
    language?: string;
  }) => JSX.Element;

  Loom: ({ src }: { src: string }) => JSX.Element;

  Youtube: ({ src }: { src: string }) => JSX.Element;
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
    CodeBlock: (props: {
      children: React.ReactNode;
      language?: string;
    }): JSX.Element => {
      const CustomCodeBlock = options?.components?.CodeBlock;

      /**
       * Temporary
       */
      return CustomCodeBlock ? (
        <CustomCodeBlock {...props} />
      ) : (
        <pre className="floe-code-block">
          <code>{props.children}</code>
        </pre>
      );
    },

    Loom: (props: { src: string }): JSX.Element => {
      const CustomLoom = options?.components?.Loom;

      return CustomLoom ? (
        <CustomLoom {...props} />
      ) : (
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            marginBottom: "1rem",
            width: "100%",
            height: 0,
          }}
          className="floe-loom"
        >
          <iframe
            src={props.src}
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></iframe>
        </div>
      );
    },

    Youtube: (props: { src: string }): JSX.Element => {
      const CustomYoutube = options?.components?.Youtube;

      return CustomYoutube ? (
        <CustomYoutube {...props} />
      ) : (
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            marginBottom: "1rem",
            width: "100%",
            height: "0",
          }}
          className="floe-youtube"
        >
          <iframe
            src={props.src}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></iframe>
        </div>
      );
    },
  };

  return Markdoc.renderers.react(transform, React, {
    components,
  });
};
