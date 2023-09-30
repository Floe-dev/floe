"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, ButtonProps } from "./Button";

export interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  subTitle?: string;
  content: React.ReactNode;
  actions: {
    text: string;
    type?: ButtonProps["type"];
    disbaled?: boolean;
    variant?: ButtonProps["variant"];
    onClick: () => void;
  }[];
}

export const Modal = ({
  open,
  setOpen,
  title,
  subTitle,
  content,
  actions,
}: ModalProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative text-left transition-all transform shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="px-4 pt-5 pb-4 bg-white rounded-t-lg sm:p-6 sm:pb-4">
                  <div className="flex items-start w-full">
                    <div className="flex-1 text-left">
                      {title && (
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {title}
                        </Dialog.Title>
                      )}
                      {subTitle && (
                        <Dialog.Title
                          as="h3"
                          className="mt-2 text-sm text-gray-500"
                        >
                          {subTitle}
                        </Dialog.Title>
                      )}
                      <div className="mt-6">{content}</div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 rounded-b-lg bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                  {actions.map((action) => (
                    <Button
                      onClick={() => {
                        action.onClick();
                      }}
                      key={action.text}
                      type={action.type}
                      disabled={action.disbaled}
                      variant={action.variant}
                    >
                      {action.text}
                    </Button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
