import React from "react";
import * as HS from "@radix-ui/react-hover-card";

interface HoverCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export const HoverCard = ({ children, content }: HoverCardProps) => (
  <HS.Root openDelay={200}>
    <HS.Trigger>{children}</HS.Trigger>
    <HS.Portal>
      <HS.Content
        className="data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[300px] rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
        sideOffset={5}
      >
        {content}
        <HS.Arrow className="fill-white" />
      </HS.Content>
    </HS.Portal>
  </HS.Root>
);
