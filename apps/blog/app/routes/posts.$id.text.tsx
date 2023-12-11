import { getUser } from "~/utils/session.server";
import type { PostWithUser } from "~/utils/db/post.server";
import { getPostBySlug } from "~/utils/db/post.server";
import invariant from "tiny-invariant";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import TTLink from "@tiptap/extension-link";
import type { Prisma, Tag, User } from "@prisma/client";
import { getTags } from "~/utils/db/tag.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "expected params.postid");

  const slug = params.id;
  const post = (await getPostBySlug(slug)) as PostWithUser;

  const dbTags = (await getTags()) as Tag[];

  const user = (await getUser(request)) as User | null;

  return json({ post, dbTags, user });
};

export default function BlogPost() {
  const { post } = useLoaderData<{
    post: PostWithUser;
    dbTags: Tag[];
    user: User;
  }>();

  const content = post.body as Prisma.JsonObject;

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
  })?.getText();

  return (
    <div className="px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-14">
      <div className="relative mx-auto max-w-lg divide-gray-200 md:max-w-3xl lg:max-w-5xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-wider text-light dark:text-dark sm:text-4xl md:flex md:justify-center">
            {post.title}
          </h2>
          <main className="relative mt-8">{editor}</main>
        </div>
      </div>
    </div>
  );
}
