"use client";

import React, { useEffect, useState } from "react";

export function Blob() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div className="box-content relative flex items-center justify-center p-20 pointer-events-none isolate h-80 w-80 mix-blend-multiply">
      <div
        // Disable animation on Safari, it causes a weird rendering issue
        className={`absolute w-full h-full ${isSafari ? "" : "animate-blob"}`}
        style={{
          filter: `contrast(290%) brightness(1000%)`,
          background: `radial-gradient(ellipse at center, rgba(50, 50, 50, 0.7) 0%, rgba(80, 80, 80, 0) 100% ), url(https://grainy-gradients.vercel.app/noise.svg)`,
        }}
      />
      <div
        className="w-full h-full bg-primary animate-blob"
        style={{
          borderRadius: "30% 50% 20% 40%",
          filter: `blur(25px)`,
          backgroundImage: `
            radial-gradient(
              ellipse at center,
              hsl(57deg 93% 55%) 0%,
              hsl(51deg 93% 50%) 4%,
              hsl(47deg 100% 47%) 9%,
              hsl(42deg 100% 46%) 17%,
              hsl(37deg 100% 45%) 28%,
              hsl(32deg 95% 44%) 41%,
              hsl(10deg 68% 49%) 56%,
              hsl(340deg 100% 37%) 71%,
              hsl(327deg 100% 30%) 85%,
              hsl(302deg 100% 20%) 94%,
              hsl(240deg 100% 20%) 100%
            )
          `,
        }}
      />
    </div>
  );
}
