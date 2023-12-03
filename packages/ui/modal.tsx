"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface RootProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export interface BodyProps {
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
}

export interface FooterProps {
  children: React.ReactNode;
}

function Root({ open, setOpen, children }: RootProps) {
  return (
    <Transition.Root as={Fragment} show={open}>
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
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
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
                    className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    onClick={() => {
                      setOpen(false);
                    }}
                    type="button"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon aria-hidden="true" className="w-6 h-6" />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function Body({ title, subTitle, children }: BodyProps) {
  return (
    <div className="px-4 pt-5 pb-4 bg-white rounded-t-lg sm:p-6 sm:pb-4">
      <div className="flex items-start w-full">
        <div className="flex-1 text-left">
          {title ? (
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              {title}
            </Dialog.Title>
          ) : null}
          {subTitle ? (
            <Dialog.Title as="h3" className="mt-2 text-sm text-gray-500">
              {subTitle}
            </Dialog.Title>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Footer({ children }: FooterProps) {
  return (
    <div className="px-4 py-3 rounded-b-lg bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
      {children}
    </div>
  );
}

export const Modal = {
  Root,
  Body,
  Footer,
};
