"use client"

import { Switch } from "@headlessui/react";
import { Toggle } from "./Toggle";

export const ToggleGroup = ({
  enabled,
  setEnabled,
  title,
  subTitle,
}: {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  title: string;
  subTitle: string;
}) => {
  return (
    <Switch.Group as="div" className="flex items-center justify-between w-full">
      <span className="flex flex-col flex-grow">
        <Switch.Label
          as="span"
          className="text-sm font-medium leading-6 text-gray-900"
          passive
        >
          {title}
        </Switch.Label>
        <Switch.Description as="span" className="text-sm text-gray-500">
          {subTitle}
        </Switch.Description>
      </span>
      <Toggle enabled={enabled} setEnabled={setEnabled} />
    </Switch.Group>
  );
};
