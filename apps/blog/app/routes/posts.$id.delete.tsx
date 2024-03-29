import { Post, User } from "@prisma/client";
import {
  ActionFunction,
  redirect,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deletePost, getPost } from "~/utils/db/post.server";
import { getUser } from "~/utils/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "expected params.id");

  const user = (await getUser(request)) as User;
  if (!user) {
    throw json("Unauthorized", { status: 401 });
  }

  const postid = params.id;
  const post = (await getPost(Number(postid))) as Post;

  return { post, user };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  // Check for delete methos
  if (form.get("_method") === "delete") {
    // Get user from cookie
    const user = await getUser(request);

    // Get post from db
    const { id } = params;
    const post = await getPost(Number(id));

    if (!post) throw new Error("Post not found");

    // delete ONLY if post created by logged in user
    if (user && post.userId === user.id) {
      await deletePost(Number(params.id));
    }

    return redirect("/posts");
  }
};

export default function EditPost() {
  const { post, user } = useLoaderData<typeof loader>();
  const transition = useNavigation();

  return (
    <div>
      Delete post - {post.id} by User - {user.id}
      <Form method="POST">
        <input type="hidden" name="_method" value="delete" />
        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {transition.state !== "idle" ? "Deleting.." : "Delete"}
        </button>
      </Form>
    </div>
  );
}
