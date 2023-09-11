"use client";

import React from "react";
import cn from "classnames";

interface AmorphousBlobProps {
  blur?: number;
  colorStops?: string[];
  rotation?: number;
  className?: string;
}

const AmorphousBlob = ({
  blur = 30,
  rotation = 180,
  className,
}: AmorphousBlobProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center pointer-events-none p-20 box-content",
        {
          [className]: className,
        }
        )}
    >
      <div
        className="w-full h-full bg-primary animate-blob"
        style={{
          borderRadius: "30% 50% 20% 40%",
          filter: `blur(${blur}px)`,
          transform: `rotate(${rotation}deg)`,
          backgroundImage: `
            linear-gradient(
              180deg,
              hsl(240deg 100% 20%) 8%,
              hsl(289deg 100% 21%) 32%,
              hsl(315deg 100% 27%) 42%,
              hsl(329deg 100% 36%) 49%,
              hsl(337deg 100% 43%) 55%,
              hsl(357deg 91% 59%) 60%,
              hsl(17deg 100% 59%) 65%,
              hsl(34deg 100% 53%) 71%,
              hsl(45deg 100% 50%) 79%,
              hsl(55deg 100% 50%) 95%
            )
          `,
        }}
      />
    </div>
  );
};

export default AmorphousBlob;
