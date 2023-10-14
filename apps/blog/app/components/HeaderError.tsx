import { Disclosure } from "@headlessui/react";
import { Link, NavLink } from "@remix-run/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { ApplificationLogo } from "~/root";

export function HeaderError() {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Posts", href: "/posts" },
    { name: "Contact", href: "/contact" },
  ];

  const navBaseStyle = `inline-flex items-center rounded-md py-2 px-3 text-lg font-medium text-light-accent dark:text-dark-accent`;
  const inactiveClassName = `${navBaseStyle} no-underline hover:underline`;
  const activeClassName = `${navBaseStyle} text-light dark:text-dark dark:text-dark`;

  return (
    <Disclosure as="header">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4  lg:px-8 ">
            <div className="relative flex h-16 justify-between">
              <div className="relative z-10 flex px-2 lg:px-0">
                <div className="flex-shrink-0 items-center">
                  <Link to="/">
                    <ApplificationLogo />
                  </Link>
                </div>
              </div>
              <div className="relative z-10 flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                <Link
                  to="/auth/signin"
                  prefetch="intent"
                  className="text-light dark:text-dark"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <nav
              className="hidden lg:flex lg:justify-center lg:space-x-8 lg:py-3"
              aria-label="Global"
            >
              {navigation.map((item) => (
                <NavLink
                  prefetch="intent"
                  to={item.href}
                  key={item.name}
                  className={({ isActive }) =>
                    isActive ? activeClassName : inactiveClassName
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </>
      )}
    </Disclosure>
  );
}
