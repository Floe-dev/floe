import React, { Fragment } from "react";
import Highlight from "prism-react-renderer";

interface FenceProps {
  children: string;
  language: string;
}

export function Fence({ children, language }: FenceProps) {
  return (
    // @ts-ignore
    <Highlight
      // {...defaultProps}
      code={children.trimEnd()}
      language={language}
      theme={undefined}
    >
      {({ className, style, tokens, getTokenProps }: any) => (
        <pre className={className} style={style}>
          <code>
            {tokens.map((line: any, lineIndex: number) => (
              <Fragment key={lineIndex}>
                {line
                  .filter((token: any) => !token.empty)
                  .map((token: any, tokenIndex: number) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                {"\n"}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
