"use client";

import { forwardRef } from "react";
import classNames from "classnames";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export function Accordion({
  items,
  className,
}: {
  items: {
    title: string;
    content: React.ReactNode;
  }[];
  className?: string;
}) {
  return (
    <AccordionPrimitive.Root
      className={`w-full bg-white rounded-lg${
        className ? ` ${className}` : ""
      }`}
      collapsible
      defaultValue="item-1"
      type="single"
    >
      {items.map((item, index) => (
        <AccordionItem key={index} value={index.toString()}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </AccordionPrimitive.Root>
  );
}

const AccordionItem = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; value: string; className?: string }
>(({ children, className, value, ...props }, forwardedRef) => (
  <AccordionPrimitive.Item
    className={classNames(
      "mt-px overflow-hidden hover:bg-zinc-50 first:mt-0 first:rounded-t-lg last:rounded-b-lg focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] shadow-[0_1px_0] shadow-zinc-200",
      className
    )}
    {...props}
    ref={forwardedRef}
    value={value}
  >
    {children}
  </AccordionPrimitive.Item>
));

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode; className?: string }
>(({ children, className, ...props }, forwardedRef) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={classNames(
        "text-zinc-900 hover:bg-zinc-50 group flex h-[45px] font-semibold flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none shadow-[0_1px_0] shadow-zinc-200 outline-none",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon
        aria-hidden
        className="h-4 w-4 text-zinc-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className, ...props }, forwardedRef) => (
  <AccordionPrimitive.Content
    className={classNames(
      "text-zinc-700 bg-zinc-50 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]",
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="py-[15px] px-5">{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = "AccordionContent";
