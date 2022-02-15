import { useLoaderData, Link, redirect, useTransition, Form } from "remix";
import type { LoaderFunction } from "remix";
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
import { Prisma } from "@prisma/client";

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = "me"; // Hack to get around remix router not reloading a page from a link in TipTap which is a normal a tag
  const page = await getPageBySlug(slug);

  const user = await getUser(request);

  const data = { page, user };
  return data;
};

export default function Page() {
  const { page, user } = useLoaderData();

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
          <div className="flex justify-center space-x-3 pb-3">
            <Link to={`/about/${page.id}/edit`}>Edit Page</Link>
            <Link to={`/about/${page.id}/delete`}>Delete Page</Link>
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
