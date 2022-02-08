import { redirect, useActionData, json, Form, useTransition } from "remix";
import type { ActionFunction } from "remix";
import { getUser } from "~/utils/session.server";
import { createPost } from "~/utils/db/post.server";
import { Post, Prisma } from "@prisma/client";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import invariant from "tiny-invariant";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { AtSymbolIcon, CodeIcon, LinkIcon } from "@heroicons/react/solid";
import { marked } from "marked";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function validateTitle(title: string) {
  if (typeof title !== "string" || title.length < 3) {
    return "Title should be at least 3 characters long";
  }
}

function validateBody(body: string) {
  if (typeof body !== "string" || body.length < 10) {
    return "Body should be at least 10 characters long";
  }
}

function validateUserId(userId: number) {
  if (typeof userId === undefined) {
    return "Expected a user id";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  invariant(user?.id, "expected user id");

  const form = await request.formData();

  const post = {
    title: form.get("title"),
    description: "the best 90's tunes",
    body: form.get("body"),
    tags: [] as Prisma.JsonArray,
    imageUrl: "http",
    userId: user.id,
  } as Post;

  const errors = {
    title: validateTitle(post.title),
    body: validateBody(post.body),
    category: "",
    imageUrl: "",
    readingTime: "",
    userId: validateUserId(post.userId),
  };

  // Return errors
  if (Object.values(errors).some(Boolean)) {
    return json({ errors, post }, { status: 422 }); // Unprocessable entity
  }

  await createPost(post);

  return redirect(`/posts`);
};

export default function NewPost() {
  const actionData = useActionData();
  const transition = useTransition();

  const [text, setText] = useState("");

  return (
    <Form method="post" className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <h3 className="text-lg font-medium leading-6 text-light dark:text-dark">
            New Post
          </h3>
          <p className="mt-1 text-sm">
            Use this form to create a new blog post using markdown syntax.
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
                actionData?.errors.title
                  ? "block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  : "block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              }`}
              defaultValue={actionData?.fields?.title}
              aria-invalid="true"
              aria-describedby="title-error"
            />
            {actionData?.errors.title && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-red-600" id="title-error">
            {actionData?.errors.title && actionData?.errors.title}
          </p>

          <div className="pt-6">
            <Tab.Group>
              {({ selectedIndex }) => (
                <>
                  <Tab.List className="flex items-center">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                            : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                          "rounded-md border border-transparent px-3 py-1.5 text-sm font-medium"
                        )
                      }
                    >
                      Write
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                            : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                          "ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium"
                        )
                      }
                    >
                      Preview
                    </Tab>

                    {/* These buttons are here simply as examples and don't actually do anything. */}
                    {selectedIndex === 0 ? (
                      <div className="ml-auto flex items-center space-x-5">
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Insert link</span>
                            <LinkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Insert code</span>
                            <CodeIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Mention someone</span>
                            <AtSymbolIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </Tab.List>
                  <Tab.Panels className="mt-2">
                    <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                      <label htmlFor="body" className="sr-only">
                        Body
                      </label>
                      <div>
                        <textarea
                          rows={5}
                          name="body"
                          id="body"
                          className={`${
                            actionData?.errors.title
                              ? "block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                              : "block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          }`}
                          defaultValue={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </div>
                    </Tab.Panel>
                    <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                      <div className="border-b">
                        <div
                          className="prose prose-pink mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: marked(text) }}
                        ></div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </>
              )}
            </Tab.Group>

            <p className="mt-2 text-sm text-red-600" id="body-error">
              {actionData?.errors.body && actionData?.errors.body}
            </p>

            <p className="mt-2 text-sm text-red-600" id="userid-error">
              {actionData?.errors.userId && actionData?.errors.userId}
            </p>
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
                {transition.state !== "idle" ? "Adding post..." : "Add post"}
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </Form>
  );
}
