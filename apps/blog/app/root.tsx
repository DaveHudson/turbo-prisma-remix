import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
} from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { getUser } from "./utils/session.server";
import styles from "./tailwind.css";
import favicon from "./images/logo-light.svg";
import favicondark from "./images/logo-dark.svg";
import faviconapple from "./images/favicon.png";
import { Search } from "ui";
import { XCircleIcon } from "@heroicons/react/24/solid";
import CommandPalette from "./components/CommandPalette";
import type { PostWithUser } from "./utils/db/post.server";
import { getPublishedPosts } from "./utils/db/post.server";
import type { User } from "@prisma/client";
import Footer from "./components/Footer";
import { LayoutError } from "./components/LayoutError";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
  ];
}

export const meta: MetaFunction = () => {
  return [{ title: "Applification" }];
};

type loaderDataType = {
  user: User | null;
  posts: PostWithUser[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = (await getUser(request)) as User;

  const posts = (await getPublishedPosts()) as PostWithUser[];

  return json({ user, posts });
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
      className="bg-gray-200 text-base dark:bg-gray-800 dark:text-dark-accent"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="theme-color"
          content="#f9fafb"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#111827"
          media="(prefers-color-scheme: dark)"
        />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        <link rel="icon" href={faviconapple} type="image/png"></link>
        <link
          rel="icon"
          type="image/svg+xml"
          href={favicon}
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href={favicondark}
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className="h-fit bg-gradient-to-b from-gray-50 to-gray-200 text-light-accent selection:bg-yellow-500 selection:text-neutral-900 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {/* {process.env.NODE_ENV === "development" ? <LiveReload /> : null} */}
      </body>
    </html>
  );
}

function Layout({ children }: React.PropsWithChildren<{}>) {
  const { user, posts } = useLoaderData<
    typeof loader
  >() as unknown as loaderDataType;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Posts", href: "/posts" },
    { name: "AI", href: "/ai" },
    { name: "Contact", href: "/contact" },
  ];
  const userNavigation = [{ name: "New Post", href: "/posts/new" }];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const navBaseStyle = `inline-flex items-center rounded-md py-2 px-3 text-lg font-medium text-light-accent dark:text-dark-accent`;
  const inactiveClassName = `${navBaseStyle} no-underline hover:underline`;
  const activeClassName = `${navBaseStyle} text-light dark:text-dark dark:text-dark`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Disclosure as="header">
        {({ open }) => (
          <>
            <CommandPalette posts={posts} />
            <div className="mx-auto max-w-7xl px-2 sm:px-4  lg:px-8 ">
              <div className="relative flex h-16 justify-between">
                <div className="relative z-10 flex px-2 lg:px-0">
                  <div className="flex-shrink-0 items-center">
                    <Link to="/">
                      <ApplificationLogo />
                    </Link>
                  </div>
                </div>
                <Search />
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
                  {user ? (
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          {user?.profileUrl && (
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user?.profileUrl}
                              alt=""
                            />
                          )}
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
                                    active
                                      ? "bg-gray-100 no-underline"
                                      : "no-underline",
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
                              className={`bg-gray-100" block w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-100`}
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
                    className="block rounded-md py-2 px-3 text-base font-medium text-light hover:bg-gray-50 hover:text-gray-900 dark:text-dark"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              {user ? (
                <div className="mb-5 border-b border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      {user?.profileUrl && (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user?.profileUrl}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-light dark:text-dark">
                        {user && user?.name}
                      </div>
                      <div className="text-sm font-medium text-light-accent dark:text-dark-accent">
                        {user && user?.username}
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
                    <form action="/auth/signout" method="POST">
                      <button
                        type="submit"
                        className={`block w-full rounded-md py-2 px-3 text-left text-base font-medium text-light underline hover:bg-gray-50 hover:text-gray-900 dark:text-dark`}
                      >
                        Sign out
                      </button>
                    </form>
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
      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <Document title="Error!">
        <LayoutError>
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon
                  className="h-8 w-8 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-medium text-red-800">
                  {`${error.status}: ${error.data.message}`}
                </h1>
                <div className="mt-2 text-sm text-red-700">
                  {error.data.message}
                </div>
              </div>
            </div>
          </div>
        </LayoutError>
      </Document>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  // let errorMessage = "Unknown error";
  // if (isDefinitelyAnError(error)) {
  //   errorMessage = error.message;
  // }

  return (
    <Document title="Error!">
      <LayoutError>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-8 w-8 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-medium text-red-800">Uh oh ...</h1>
              <div className="mt-2 text-sm text-red-700">
                Something went wrong.
              </div>
            </div>
          </div>
        </div>
      </LayoutError>
    </Document>
  );
}

export function ApplificationLogo(
  props: React.ComponentPropsWithoutRef<"svg">
) {
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
