import { getUser } from "~/utils/session.server";
import { getPageBySlug } from "~/utils/db/page.server";
import invariant from "tiny-invariant";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import TTLink from "@tiptap/extension-link";
import { Page, Prisma, User } from "@prisma/client";
import dayjs from "dayjs";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "expected params.id");

  const slug = params.id;
  const page = (await getPageBySlug(slug)) as Page;

  const user = (await getUser(request)) as User;

  return { page, user };
};

export default function AboutSubPage() {
  const { page, user } = useLoaderData<typeof loader>();

  const content = page.body as Prisma.JsonObject;

  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Highlight, Typography, Image, Dropcursor, TTLink],
    editorProps: {
      attributes: {
        class:
          "prose focus:outline-none max-w-none max-w-3xl prose-img:rounded-lg pt-8 first-line:uppercase first-line:tracking-widest tracking-wider first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left dark:prose-invert",
      },
    },
    content,
  });

  return (
    <div className="px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-14">
      <div className="relative mx-auto max-w-lg divide-gray-200 md:max-w-3xl lg:max-w-5xl">
        {user?.id === page.userId && (
          <div className="mb-10 border-b border-gray-200 pb-5">
            <div className="sm:flex sm:items-baseline sm:justify-between">
              <div className="sm:w-0 sm:flex-1">
                <h1
                  id="message-heading"
                  className="text-lg font-medium text-light dark:text-dark"
                >
                  {page.title}
                </h1>
                <p className="mt-1 overflow-hidden overflow-ellipsis text-sm text-gray-500">
                  <time dateTime={dayjs(page.updatedAt).format("MMM D, YYYY")}>
                    Last updated {dayjs(page.updatedAt).format("MMM D, YYYY")}
                  </time>
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
                <span className="inline-flex items-center rounded bg-neutral-700 px-2 py-0.5 text-xs font-medium text-neutral-200">
                  <svg
                    className="mr-1.5 h-2 w-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx={4} cy={4} r={3} />
                  </svg>
                  Published
                </span>

                <Menu as="div" className="relative ml-3 inline-block text-left">
                  <div>
                    <Menu.Button className="-my-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <span className="sr-only">Open options</span>
                      <EllipsisVerticalIcon
                        className="h-5 w-5"
                        aria-hidden="true"
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
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/about/${page.id}/edit`}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "flex justify-between px-4 py-2 text-sm no-underline"
                              )}
                            >
                              <span>Edit</span>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/about/${page.id}/delete`}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "flex justify-between px-4 py-2 text-sm no-underline"
                              )}
                            >
                              <span>Delete</span>
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-light dark:text-dark sm:text-4xl md:flex md:justify-center">
            {page.title}
          </h2>
        </div>

        <div className="md:flex md:justify-center">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
