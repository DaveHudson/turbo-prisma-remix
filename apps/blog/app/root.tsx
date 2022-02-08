import {
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "remix";
import { Fragment, SVGProps } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import type { MetaFunction } from "remix";
import { getUser } from "./utils/session.server";
import styles from "./tailwind.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
  ];
}

export const meta: MetaFunction = () => {
  return { title: "Applification" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const data = await getUser(request);

  if (!data) {
    return null;
  }

  return data;
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html
      lang="en"
      className="h-full bg-gradient-to-b from-white to-gray-200 text-light-accent dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:text-dark-accent"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

function Layout({ children }: React.PropsWithChildren<{}>) {
  const user = useLoaderData();

  const navigation = [
    { name: "Home", href: "/", current: true },
    { name: "Posts", href: "/posts", current: false },
    { name: "Contact", href: "/contact", current: false },
  ];
  const userNavigation = [
    { name: "New Post", href: "/posts/new" },
    { name: "Settings", href: "#" },
  ];

  const footernavigation = [
    {
      name: "Twitter",
      href: "https://twitter.com/applificationhq",
      icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "https://github.com/DaveHudson",
      icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Linked In",
      href: "https://www.linkedin.com/in/hudsond/",
      icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
          </svg>
        </svg>
      ),
    },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const navBaseStyle = `inline-flex items-center rounded-md py-2 px-3 text-sm font-medium text-light-accent dark:text-dark-accent`;
  const activeClassName = `${navBaseStyle} text-light dark:text-dark bg-gray-100 dark:text-dark dark:bg-gray-800`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Disclosure as="header">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="relative z-10 flex px-2 lg:px-0">
                  <div className="flex-shrink-0 items-center">
                    <Link to="/">
                      <ApplificationLogo />
                    </Link>
                  </div>
                </div>
                <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                  <div className="w-full sm:max-w-xs">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="search"
                        name="search"
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-sky-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                        placeholder="Search"
                        type="search"
                      />
                    </div>
                  </div>
                </div>
                <div className="relative z-10 flex items-center lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                  {user ? (
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user?.profileUrl}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block py-2 px-4 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                          <form action="/auth/signout" method="POST">
                            <button
                              type="submit"
                              className={`bg-gray-100" block py-2 px-4 text-sm text-gray-700`}
                            >
                              Sign out
                            </button>
                          </form>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <Link
                      to="/auth/signin"
                      prefetch="intent"
                      className="text-light dark:text-dark"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
              <nav
                className="hidden lg:flex lg:justify-center lg:space-x-8 lg:py-3"
                aria-label="Global"
              >
                {navigation.map((item) => (
                  <NavLink
                    to={`${item.href}`}
                    key={item.name}
                    className={({ isActive }) =>
                      isActive ? activeClassName : navBaseStyle
                    }
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <Disclosure.Panel
              as="nav"
              className="lg:hidden"
              aria-label="Global"
            >
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-light dark:text-dark"
                        : "text-light hover:bg-gray-50 hover:text-gray-900 dark:text-dark",
                      "block rounded-md py-2 px-3 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              {user ? (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user?.profileUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-light dark:text-dark">
                        {user?.name}
                      </div>
                      <div className="text-sm font-medium text-light-accent dark:text-dark-accent">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md py-2 px-3 text-base font-medium text-light hover:bg-gray-50 hover:text-gray-900 dark:text-dark"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to="/auth/signin"
                  prefetch="intent"
                  className="block rounded-md py-2 px-3 text-base font-medium text-light dark:text-dark"
                >
                  Sign in
                </Link>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {children}
      <footer>
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            {footernavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} Applification Ltd.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

function ApplificationLogo(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="73.400025"
      height="34.2"
      viewBox="0 0 734 342"
      className="mt-4 w-12 fill-[#303131] dark:fill-[#FAFAFA]"
      fill="none"
    >
      <path d="M262 11.7c-9.1 3.2-15.8 9.2-20.8 18.7l-2.7 5.1v271l3.4 6.3c6 11 15.6 17.7 27.9 19.3 9.5 1.2 190 1.1 198.6-.1 12.9-1.9 22.8-9.2 28.5-21l2.6-5.5v-269l-2.9-5.9c-3.6-7.3-9.6-13.5-16.8-17.3l-5.3-2.8-104-.2c-92.6-.2-104.5-.1-108.5 1.4zM455 165v110H283V55h172v110zm-78 122.5c13.5 7 10.5 28.1-4.5 31.5-10.1 2.3-20.4-6.4-20.5-17 0-4.5 3.6-10.8 7.9-13.7 4.1-2.7 12.6-3.1 17.1-.8z" />
      <path d="M357.9 132.4c-23.1 8.9-31.9 36.1-18.2 56.4 15.8 23.3 51.6 20.6 64.1-4.8 2.4-5 2.7-6.6 2.7-16.5 0-10.1-.2-11.4-2.8-16.3-4-7.5-8.7-12.4-15.9-16.3-5.8-3.1-7.1-3.4-16.3-3.6-6.7-.2-11.2.2-13.6 1.1zM89.3 47.2c-19.7 20.3-34.6 47.5-42.2 77.6-14.7 57.3 2.5 124.4 43 167.6l6.2 6.7 8.4-8.3c4.7-4.6 10.3-10.5 12.5-13.1l4.1-4.8-5-5.2c-13.7-14.1-25.8-35.6-31.9-56.7-7.5-25.8-7.5-56.2.1-82.5 5.7-19.6 17.1-40 30.5-54.8l6.2-6.8-12.3-12.7c-6.8-7-12.6-12.8-12.9-13-.3-.1-3.3 2.6-6.7 6zM625.4 54.8l-12.1 11.7 7.9 9.5c24.3 28.9 35 61.7 33.5 102-.9 23-5 39.6-14.5 58.5-6.7 13.4-12.6 21.9-22.5 32.3l-5 5.4 12.4 12.4c6.8 6.8 12.8 12.4 13.4 12.4.6 0 3.3-2.4 6.1-5.3C672.2 265 688.2 228.8 692 186c3.7-40.8-10.4-89-35.8-122.5C650.5 56.1 639 43 638.1 43c-.3.1-6 5.4-12.7 11.8zM175.8 93.2c-17 19.4-26.7 39.1-29.8 60.7-1.8 12.2-.8 30.3 2.4 42.4 2.8 11 10.2 27.3 16.5 36.5 5.8 8.6 13.9 18.2 15.4 18.2 1.3 0 22.7-21 22.7-22.3 0-.4-2.2-3.5-4.9-6.8-6.6-8.1-11.4-17.5-14.7-28.4-3.4-11.5-3.8-28.9-1-39.9 3.9-14.7 10.5-27.3 19.3-36.7l4.5-4.8-11.8-12.6C187.9 92.6 182.3 87 182 87c-.4 0-3.1 2.8-6.2 6.2zM542 100.5 530.6 112l3 3.2c8 8.5 15.2 22.8 18.5 36.5 2.7 11.2 2.2 27.8-1.1 39.3-2.9 10.1-9.8 23.2-16.6 31.4l-5.6 6.8 12.2 12.2 12.1 12.1 6.5-7c21.8-23.6 32.8-55.4 29.5-85-2.7-23.5-12-44.9-28.8-65.8-2.9-3.7-5.7-6.7-6.1-6.7-.4 0-5.9 5.2-12.2 11.5z" />
    </svg>
  );
}
