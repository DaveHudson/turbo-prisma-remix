import { Post, Prisma, User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { marked } from "marked";

export interface PostWithUser extends Post {
  user: User;
}

function calculateReadingTime(text: string) {
  const words = text.split(" ").length;
  const readingTimeMin = Number(words / 200).toFixed(1);
  const readingTimeSecs = Number((words / 200).toFixed(3).substring(3)) * 0.6;
  let finalReadingTime;

  if (readingTimeSecs > 30) {
    finalReadingTime = Math.round(Number(readingTimeMin));
  } else {
    finalReadingTime = readingTimeMin;
  }

  return `${finalReadingTime} min read`;
}

export async function getPosts() {
  const posts = await db.post.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });
  return posts as PostWithUser[];
}

export async function getPost(postid: number) {
  const post = await db.post.findUnique({
    where: { id: postid },
    include: {
      user: true,
    },
  });

  if (!post) throw new Error("Post not found");

  const postHtml = marked(post.body);

  const postData = {
    ...post,
    body: postHtml,
  };

  return postData as PostWithUser;
}

export async function createPost(fields: Post) {
  const post = {
    ...fields,
    tags: fields.tags as Prisma.JsonArray,
    readingTime: calculateReadingTime(fields.body),
  };

  const res = await db.post.create({ data: { ...post, userId: post.userId } });
  return res.id;
}

export async function deletePost(postid: number) {
  const res = await db.post.delete({ where: { id: postid } });
  return res;
}
