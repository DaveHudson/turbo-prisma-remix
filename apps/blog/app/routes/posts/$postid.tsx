import { useLoaderData, Link, redirect, useTransition, Form } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { getUser } from "~/utils/session.server";
import { deletePost, getPost } from "~/utils/db/post.server";
import invariant from "tiny-invariant";
import { ReactChild, ReactFragment, ReactPortal } from "react";

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.postid, "expected params.postid");

  const postid = params.postid;
  const post = await getPost(Number(postid));

  const data = { post };
  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  // Check for delete methos
  if (form.get("_method") === "delete") {
    // Get user from cookie
    const user = await getUser(request);

    // Get post from db
    const { postid } = params;
    const post = await getPost(Number(postid));

    if (!post) throw new Error("Post not found");

    // delete ONLY if post created by logged in user
    if (user && post.userId === user.id) {
      await deletePost(Number(params.postid));
    }

    return redirect("/posts");
  }
};

export default function Post() {
  const { post } = useLoaderData();
  const transition = useTransition();

  return (
    <div className="pt-16 pb-20 px-4 sm:px-6 lg:pt-16 lg:pb-14 lg:px-8">
      <div className="relative max-w-lg mx-auto  divide-gray-200 md:max-w-3xl lg:max-w-5xl">
        <div>
          <h2 className="text-3xl tracking-tight font-extrabold text-light dark:text-dark sm:text-4xl">{post.title}</h2>

          <div className="relative mt-1">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-light dark:bg-dark px-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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

          <div className="flex justify-center space-x-3 pt-3">
            {post.tags.map(
              (tag: { color: any; name: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined }) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tag.color}`}>
                  {tag.name}
                </span>
              )
            )}
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              3 min read
            </span>
          </div>

          <p className="pt-4 mt-3 text-xl text-light-accent dark:text-dark-accent sm:mt-4">{post.description}</p>

          <div className="mt-6 flex items-center">
            <div className="flex-shrink-0">
              <Link to={post.user.id}>
                <span className="sr-only">{post.user.name}</span>
                <img className="h-10 w-10 rounded-full" src={post.user.profileUrl} alt="" />
              </Link>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-light dark:text-dark">
                <Link to={post.user.id}>{post.user.name}</Link>
              </p>
              <div className="flex space-x-1 text-sm text-light-accent dark:text-dark-accent">
                <time dateTime={post.datetime}>{post.date}</time>
              </div>
            </div>
          </div>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-light dark:bg-dark px-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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

        <div className="text-lg prose mx-auto pt-8">
          <div className="prose prose-pink dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>

        {/* {user?.id === post.userId && (
          <div className="pt-3">
            <Form method="post">
              <input type="hidden" name="_method" value="delete" />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {transition.state !== "idle" ? "Deleting.." : "Delete"}
              </button>
            </Form>
          </div>
        )} */}
      </div>
    </div>
  );
}
