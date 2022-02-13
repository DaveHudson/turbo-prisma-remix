import { useLoaderData, Link, redirect, useTransition, Form } from "remix";
import type { LoaderFunction } from "remix";
import { getUser } from "~/utils/session.server";
import { getPostBySlug } from "~/utils/db/post.server";
import invariant from "tiny-invariant";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import TTLink from "@tiptap/extension-link";
import { Prisma } from "@prisma/client";
import RenderTags from "~/components/RenderTags";
import { getTags } from "~/utils/db/tag.server";
import dayjs from "dayjs";

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.postid, "expected params.postid");

  const slug = params.postid;
  const post = await getPostBySlug(slug);

  const dbTags = await getTags();

  const user = await getUser(request);

  const data = { post, dbTags, user };
  return data;
};

export default function Post() {
  const { post, dbTags, user } = useLoaderData();

  const content = post.body as Prisma.JsonObject;

  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Highlight, Typography, Image, Dropcursor, TTLink],
    editorProps: {
      attributes: {
        class:
          "prose focus:outline-none max-w-none max-w-3xl prose-img:rounded-lg pt-8 first-line:uppercase first-line:tracking-widest first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left dark:prose-invert",
      },
    },
    content,
  });

  return (
    <div className="px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-14">
      <div className="relative mx-auto max-w-lg divide-gray-200 md:max-w-3xl lg:max-w-5xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-light dark:text-dark sm:text-4xl">
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
              <span className="sr-only">{post.user.name}</span>
              <img
                className="h-10 w-10 rounded-full"
                src={post.user.profileUrl}
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-light dark:text-dark">
                {post.user.name}
              </p>
              <div className="flex space-x-1 text-sm">
                <time dateTime={dayjs(post.createdAt).format("MMM D, YYYY")}>
                  {dayjs(post.createdAt).format("MMM D, YYYY")}
                </time>
              </div>
            </div>
          </div>

          <RenderTags tags={post.tags} dbTags={dbTags} />

          <div className="flex justify-center space-x-3 pt-4">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              {post.readingTime}
            </span>
          </div>

          {user?.id === post.userId && (
            <div className="flex justify-center space-x-3 pt-3">
              <Link to={`/posts/${post.id}/edit`}>Edit Post</Link>
              <Link to={`/posts/${post.id}/delete`}>Delete Post</Link>
            </div>
          )}

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

        <div className="md:flex md:justify-center">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
