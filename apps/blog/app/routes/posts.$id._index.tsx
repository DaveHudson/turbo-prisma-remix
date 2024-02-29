import { getUser } from "~/utils/session.server";
import type { PostWithUser } from "~/utils/db/post.server";
import { getPostBySlug } from "~/utils/db/post.server";
import invariant from "tiny-invariant";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import TTLink from "@tiptap/extension-link";
import YouTube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import ReactComponent from "../components/tiptap/react/extension";
import type { Prisma, Tag, User } from "@prisma/client";
import { PostStatus } from "@prisma/client";
import RenderTags from "~/components/RenderTags";
import { getTags } from "~/utils/db/tag.server";
import dayjs from "dayjs";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { Link, useLoaderData } from "@remix-run/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const lowlight = createLowlight(common);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "expected params.postid");

  const slug = params.id;
  const post = (await getPostBySlug(slug)) as PostWithUser;

  const dbTags = (await getTags()) as Tag[];

  const user = (await getUser(request)) as User | null;

  return json({ post, dbTags, user });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.post.title },
    {
      property: "og:title",
      content: data?.post.title,
    },
    {
      property: "og:description",
      content: data?.post.description,
    },
    {
      property: "og:type",
      content: "article",
    },
    {
      property: "og:url",
      content: `https://applification.net/posts/${data?.post.slug}`,
    },
    {
      property: "og:image",
      content: "https://applification.net/og_image.png",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      property: "twitter:domain",
      content: `https://applification.net`,
    },
    {
      property: "twitter:url",
      content: `https://applification.net/posts/${data?.post.slug}`,
    },
    {
      name: "twitter:title",
      content: data?.post.title,
    },
    {
      name: "twitter:description",
      content: data?.post.description,
    },
    {
      name: "twitter:image",
      content: "https://applification.net/og_image.png",
    },
  ];
};

export default function BlogPost() {
  const { post, dbTags, user } = useLoaderData<{
    post: PostWithUser;
    dbTags: Tag[];
    user: User;
  }>();

  const content = post.body as Prisma.JsonObject;

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Image,
      Dropcursor,
      TTLink,
      YouTube.configure({}),
      ReactComponent,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
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
        {user?.id === post.userId && (
          <div className="mb-10 border-b border-gray-200 pb-5">
            <div className="sm:flex sm:items-baseline sm:justify-between">
              <div className="sm:w-0 sm:flex-1">
                <h1
                  id="message-heading"
                  className="text-lg font-medium text-light dark:text-dark"
                >
                  {post.title}
                </h1>
                <p className="mt-1 overflow-hidden overflow-ellipsis text-sm text-gray-500">
                  <time dateTime={dayjs(post.updatedAt).format("MMM D, YYYY")}>
                    Last updated {dayjs(post.updatedAt).format("MMM D, YYYY")}
                  </time>
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
                {post.published === PostStatus.DRAFT ? (
                  <span className="inline-flex items-center rounded bg-neutral-700 px-2 py-0.5 text-xs font-medium text-neutral-200">
                    <svg
                      className="mr-1.5 h-2 w-2 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Draft
                  </span>
                ) : (
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
                )}

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
                              to={`/posts/${post.id}/edit`}
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
                              to={`/posts/${post.id}/delete`}
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
          <h2 className="text-3xl font-extrabold tracking-wider text-light dark:text-dark sm:text-4xl md:flex md:justify-center">
            {post.title}
          </h2>
          <div className="relative mt-8">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="rounded-lg bg-light py-1 px-2 text-gray-500 ring-1 ring-gray-400 dark:bg-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="mt-6 mb-3 flex justify-center">
            <div className="flex-shrink-0">
              <span className="sr-only">{post?.user?.name}</span>
              {user?.profileUrl && (
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.profileUrl!}
                  alt=""
                />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-light dark:text-dark">
                {user?.name}
              </p>
              <div className="flex space-x-1 text-sm">
                <time dateTime={dayjs(post.createdAt).format("MMM D, YYYY")}>
                  {dayjs(post.createdAt).format("MMM D, YYYY")}
                </time>
              </div>
            </div>
          </div>
          {/* @ts-expect-error */}
          <RenderTags tags={post.tags} dbTags={dbTags} />
          <div className="flex justify-center space-x-3 pt-4">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              {post.readingTime}
            </span>
          </div>
          <div className="relative mt-8">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="rounded-lg bg-light py-1 px-2 text-gray-500 ring-1 ring-gray-400 dark:bg-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <main className="md:flex md:justify-center">
          <EditorContent editor={editor} className="content" />
        </main>
      </div>
    </div>
  );
}
