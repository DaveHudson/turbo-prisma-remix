import { getUser } from "~/utils/session.server";
import { getPost, updatePost } from "~/utils/db/post.server";
import type { Post, Prisma, Tag, User } from "@prisma/client";
import { PostStatus } from "@prisma/client";
import invariant from "tiny-invariant";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import Link from "@tiptap/extension-link";
import YouTube from "@tiptap/extension-youtube";
import CodeBlockPrism from "../components/tiptap/codeblockprism";
import ReactComponent from "../components/tiptap/react/extension";
import {
  PhotoIcon,
  CodeBracketIcon,
  EllipsisHorizontalIcon,
  ExclamationCircleIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import Select from "react-select";
import { getTags } from "~/utils/db/tag.server";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  Form,
  useNavigation,
} from "@remix-run/react";

type actionDataType = {
  errors?: {
    title: string;
    slug: string;
    body: string;
    userId: string;
    description: string;
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "expected params.id");

  const user = (await getUser(request)) as User;

  if (!user) {
    throw json("Unauthorized", { status: 401 });
  }

  const postid = params.id;

  const dbTags = (await getTags()) as Tag[];

  const post = (await getPost(Number(postid))) as Post;
  invariant(post, "expected post to exist");

  const postTags = post.tags as [];

  invariant(post.tags, "expect post tags to exist");

  // Selected Tags
  const selectedTags = [] as Tag[];

  postTags.forEach((tag) => {
    const tagDetails = dbTags.find((x) => x.id === Number(tag)) as Tag;
    selectedTags.push(tagDetails);
  });

  return json({ post, dbTags, user, selectedTags });
};

function validateTitle(title: string) {
  if (typeof title !== "string" || title.length < 3) {
    return "Title should be at least 3 characters long";
  }
}

function validateSlug(slug: string) {
  if (typeof slug !== "string" || slug.length < 3) {
    return "Slug should be at least 3 characters long";
  }
}

function validateUserId(userId: number) {
  if (typeof userId === undefined) {
    return "Expected a user id";
  }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = await getUser(request);
  invariant(user?.id, "expected user id");

  const form = await request.formData();
  const formbody = form.get("body");
  const tags = form.getAll("tags");

  invariant(formbody, "expect formbody to exist");

  const post = {
    id: Number(params.id),
    title: form.get("title"),
    slug: form.get("slug"),
    description: form.get("description"),
    published: form.get("published"),
    //@ts-ignore
    body: JSON.parse(formbody) as unknown as Prisma.JsonObject,
    tags: tags as Prisma.JsonArray,
    imageUrl: "http",
    userId: user.id,
  } as Post;

  const errors = {
    title: validateTitle(post.title),
    slug: validateSlug(post.slug),
    body: "",
    category: "",
    imageUrl: "",
    readingTime: "",
    userId: validateUserId(post.userId),
  };

  // Return errors
  if (Object.values(errors).some(Boolean)) {
    return json({ errors, post }, { status: 422 }); // Unprocessable entity
  }

  await updatePost(post);

  return redirect(`/posts/${post.slug}`);
};

export default function EditPost() {
  const actionData = useActionData<
    typeof action
  >() as unknown as actionDataType;
  const errors = actionData?.errors;
  const transition = useNavigation();

  const { post, dbTags, selectedTags } = useLoaderData<typeof loader>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Image,
      Dropcursor,
      Link,
      Gapcursor,
      YouTube.configure({}),
      ReactComponent,
      CodeBlockPrism.configure({
        defaultLanguage: "jsx",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert focus:outline-none mt-2 w-full p-3 border-t-2 border-gray-300  max-w-none",
      },
    },
    content: post.body as string,
  });

  const addImage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const url = window.prompt("URL");

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const addHR = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    editor?.commands.setHorizontalRule();
  };

  const addYoutubeVideo = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor?.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 360,
        // width: Math.max(320, parseInt(widthRef.current.value, 10)) || 640,
        // height: Math.max(180, parseInt(heightRef.current.value, 10)) || 480,
      });
    }
  };

  const addTweetEmbed = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const url = prompt("Enter Tweet ID");

    if (url) {
      editor?.commands.setReactComponent({ src: url });
    }
  };

  const addCodeBlock = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    editor?.commands.setCodeBlock();
  };

  const json = editor?.getJSON();

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      className="space-y-8 divide-y divide-gray-300"
    >
      <div className="space-y-8 divide-y divide-gray-300">
        <div>
          <h3 className="text-lg font-medium leading-6 text-light dark:text-dark">
            Update Post
          </h3>
          <p className="mt-1 text-sm">
            Use this form to update a blog post using markdown syntax.
          </p>
        </div>

        <fieldset disabled={transition.state === "submitting"} className="pt-6">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="title"
              id="title"
              className={`${
                errors && errors.title
                  ? "block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  : "block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              }`}
              defaultValue={post.title}
              aria-invalid="true"
              aria-describedby="title-error"
            />
            {errors && errors.title && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-red-600" id="title-error">
            {errors && errors.title && errors.title}
          </p>

          <label htmlFor="slug" className="block text-sm font-medium">
            Slug
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="slug"
              id="slug"
              className={`${
                errors && errors.slug
                  ? "block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  : "block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              }`}
              defaultValue={post.slug}
              aria-invalid="true"
              aria-describedby="slug-error"
            />
            {errors && errors.slug && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-red-600" id="slug-error">
            {errors && errors.slug && errors.slug}
          </p>

          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="description"
              id="description"
              className={`${
                errors && errors.description
                  ? "block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  : "block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              }`}
              defaultValue={post.description}
              aria-invalid="true"
              aria-describedby="description-error"
            />
            {errors && errors.description && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-red-600" id="description-error">
            {errors && errors.description && errors.description}
          </p>

          <label htmlFor="tags" className="block text-sm font-medium">
            Tags
          </label>
          <Select
            name="tags"
            id="tags"
            options={dbTags}
            getOptionValue={(dbTags) => dbTags.id.toString()}
            getOptionLabel={(dbTags) => dbTags.name}
            isMulti
            defaultValue={selectedTags}
          />

          <div>
            <label
              htmlFor="published"
              className="block text-sm font-medium text-gray-700"
            >
              Published
            </label>
            <select
              id="published"
              name="published"
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              defaultValue={post.published}
            >
              <option>{PostStatus.DRAFT}</option>
              <option>{PostStatus.PUBLISHED}</option>
            </select>
          </div>

          <div className="pt-6">
            <span className="relative z-0 inline-flex rounded-md shadow-sm">
              <button
                onClick={addImage}
                type="button"
                className="relative inline-flex items-center rounded-l-md border border-gray-500 bg-none px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:hover:text-gray-100"
              >
                <span className="sr-only">Add image</span>
                <PhotoIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={addHR}
                type="button"
                className="relative inline-flex items-center border-t border-b border-r border-gray-500 bg-none px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:hover:text-gray-100"
              >
                <span className="sr-only">Add hr</span>
                <EllipsisHorizontalIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
              <button
                onClick={addYoutubeVideo}
                type="button"
                className="relative inline-flex items-center border-t border-b border-r border-gray-500 bg-none px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:hover:text-gray-100"
              >
                <span className="sr-only">Add YouTube video</span>
                <VideoCameraIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={addTweetEmbed}
                type="button"
                className="relative inline-flex items-center border-t border-b border-gray-500 bg-none px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:hover:text-gray-100"
              >
                <span className="sr-only">Add Tweet embed</span>
                <ChatBubbleLeftRightIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
              <button
                onClick={addCodeBlock}
                type="button"
                className="0 relative -ml-px inline-flex items-center rounded-r-md border border-gray-500 bg-none px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:hover:text-gray-100"
              >
                <span className="sr-only">Add code block</span>
                <CodeBracketIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </span>

            <div className="pt-2">
              <EditorContent editor={editor} />
              <input
                type="hidden"
                name="body"
                id="body"
                value={JSON.stringify(json)}
              />
              <p className="mt-2 text-sm text-red-600" id="body-error">
                {errors && errors.body && errors.body}
              </p>
              <p className="mt-2 text-sm text-red-600" id="userid-error">
                {errors && errors.userId && errors.userId}
              </p>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                {transition.state !== "idle"
                  ? "Updating post..."
                  : "Update post"}
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </Form>
  );
}
