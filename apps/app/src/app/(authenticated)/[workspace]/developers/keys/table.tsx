import { Pill } from "@floe/ui";
import type { Prisma } from "@floe/db";
import { KeyIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { deleteKey } from "./actions";

export function Table({
  workspace,
}: {
  workspace: Prisma.WorkspaceGetPayload<{
    include: {
      encrytpedKeys: {
        select: {
          name: true;
          slug: true;
          createdAt: true;
        };
      };
    };
  }>;
}) {
  if (!workspace.encrytpedKeys.length) {
    return (
      <div className="w-full py-4 font-mono text-sm text-center rounded bg-zinc-100 text-zinc-500">
        <KeyIcon className="w-6 h-6 mx-auto mb-2" />
        No keys
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y table-fixed divide-zinc-300">
      <thead>
        <tr>
          <th
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 sm:pl-0"
            scope="col"
          >
            Name
          </th>
          <th
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 sm:pl-0"
            scope="col"
          >
            Slug
          </th>
          <th
            className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900"
            scope="col"
          >
            Token
          </th>
          <th
            className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900"
            scope="col"
          >
            Created
          </th>
          <th />
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-200">
        {workspace.encrytpedKeys.map((key) => (
          <tr key={key.slug}>
            <td className="py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 whitespace-nowrap sm:pl-0">
              {key.name}
            </td>
            <td className="py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 whitespace-nowrap sm:pl-0">
              <Pill color="gray" fontStlye="mono" text={workspace.slug} />
            </td>
            <td className="px-3 py-4 text-sm text-zinc-500 whitespace-nowrap">
              <Pill
                color="gray"
                fontStlye="mono"
                text={`secret_••••••••••••••••${key.slug}`}
              />
            </td>
            <td className="flex items-center gap-1 px-3 py-4 text-sm text-zinc-500 whitespace-nowrap">
              <time
                className="mt-2 nx-text-gray-500 dark:nx-text-gray-400"
                dateTime={new Date(key.createdAt).toLocaleDateString()}
                suppressHydrationWarning
              >
                {new Date(key.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </td>
            <td>
              <Menu as="div" className="relative text-right">
                <Menu.Button className="p-1 rounded-full hover:bg-zinc-100 focus:outline-none">
                  <EllipsisVerticalIcon className="w-5 h-5 text-zinc-900" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute bottom-full right-0 z-10 mb-2.5 min-w-[150px] rounded-md bg-white py-2 shadow-lg ring-1 ring-zinc-900/5 focus:outline-none">
                    <Menu.Item>
                      <button
                        className="flex items-center w-full gap-2 px-3 py-1 text-sm leading-6 text-left text-zinc-900 hover:bg-zinc-50"
                        onClick={() => deleteKey(key.slug, workspace.id)}
                        type="button"
                      >
                        <TrashIcon className="h-5" /> Delete key
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
