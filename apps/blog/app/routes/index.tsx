import { Button } from "ui";
import { Post, PrismaClient } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";

export const loader: LoaderFunction = async () => {
  let db = new PrismaClient();
  const posts = await db.post.findMany({
    take: 20,
  });
  return posts as Post[];
};

export default function Index() {
  const posts = useLoaderData<Post[]>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <Button />
      {posts.map((post) => (
        <div key={post.title}>{post.title}</div>
      ))}
    </div>
  );
}
