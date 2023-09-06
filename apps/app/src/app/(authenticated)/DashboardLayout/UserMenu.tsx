import { Menu, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Fragment } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import cn from "classnames";

const UserMenu = () => {
  const { data } = useSession();

  if (!data) {
    return null;
  }

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="relative flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <img
            className="w-8 h-8 bg-gray-400 rounded-full"
            src={data.user?.image || ""}
            alt="User image"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {/* <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={cn("block px-4 py-2 text-sm text-gray-700", {
                  "bg-gray-100": active,
                })}
              >
                Your Profile
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={cn("block px-4 py-2 text-sm text-gray-700", {
                  "bg-gray-100": active,
                })}
              >
                Settings
              </a>
            )}
          </Menu.Item> */}
          <Menu.Item>
            {({ active }) => (
              <button
                className={cn("block px-4 py-2 text-sm text-gray-700 w-full text-left", {
                  "bg-gray-100": active,
                })}
                onClick={() => signOut()}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
