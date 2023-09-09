import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SelectProps {
  label?: string;
  list: { id: string; name: string; unavailable?: boolean }[];
  selected: { id: string; name: string; unavailable?: boolean };
  setSelected: (selected: {
    id: string;
    name: string;
    unavailable?: boolean;
  }) => void;
  subtext?: string;
  errortext?: string;
}

export const Select = ({
  label,
  selected,
  setSelected,
  list,
  subtext,
  errortext,
}: SelectProps) => {
  const textColor = (active: boolean, unavailable?: boolean) => {
    if (unavailable) {
      return "text-gray-500";
    }

    if (active) {
      return "bg-indigo-600 text-white";
    }

    return "text-gray-900";
  };

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div>
          {label && (
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
              {label}
            </Listbox.Label>
          )}
          <div className="relative mt-2">
            <Listbox.Button
              className={classNames(
                "relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6",
                selected.unavailable ? "text-gray-500" : "text-gray-900"
              )}
            >
              <span className="block truncate">{selected.name}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronUpDownIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {list.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    className={({ active }) =>
                      classNames(
                        textColor(active, item.unavailable),
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={item}
                    disabled={item.unavailable}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {item.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
          {(subtext || errortext) && (
            <p
              className={classNames(
                "mt-2 text-sm",
                errortext ? "text-red-500" : "text-gray-500"
              )}
            >
              {errortext || subtext}
            </p>
          )}
        </div>
      )}
    </Listbox>
  );
};
