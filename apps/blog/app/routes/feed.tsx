import { json } from "@remix-run/node"; // or cloudflare/deno
import { getLatestPosts } from "~/utils/db/post.server";

export async function loader() {
  const posts = await getLatestPosts();
  return json(posts);
}
