import { Post, PostStatus, Prisma, User } from "@prisma/client";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export interface PostWithUser extends Post {
  user: User;
}

let allWordsInPost = "";
function calculateReadingTime(text: Prisma.JsonObject) {
  // ? Text is sotred in JSON blocks we need to dig into each block to get all the words
  //@ts-ignore
  text.content?.forEach((element: any) => {
    element.content?.forEach((item: any) => {
      allWordsInPost = `${allWordsInPost} ${item.text}`;
    });
  });

  const words = allWordsInPost.split(" ").length;
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
    where: {
      published: PostStatus.PUBLISHED,
    },
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });
  return posts as PostWithUser[];
}

export async function getPostsByTag(tag: string) {
  const selectedTag = await db.tag.findFirst({
    where: {
      name: tag,
    },
  });

  const posts = await db.post.findMany({
    where: {
      tags: {
        array_contains: selectedTag?.id.toString(),
      },
    },
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

  const postData = {
    ...post,
  };

  return postData as PostWithUser;
}

export async function createPost(fields: Post) {
  const body = fields.body as Prisma.JsonObject;
  invariant(body, "expected body to exits");

  const tags = fields.tags as [];

  const post = {
    ...fields,
    body: body as Prisma.JsonObject,
    tags: tags as Prisma.JsonArray,
    readingTime: calculateReadingTime(body),
  };

  const res = await db.post.create({ data: { ...post, userId: post.userId } });
  return res.id;
}

export async function updatePost(fields: Post) {
  const body = fields.body as Prisma.JsonObject;
  invariant(body, "expected body to exits");

  const tags = fields.tags as Number[];

  const published = fields.published;

  const post = {
    ...fields,
    id: fields.id as number,
    published,
    body: body as Prisma.JsonObject,
    tags: tags as Prisma.JsonArray,
    readingTime: calculateReadingTime(body),
  };

  const res = await db.post.update({
    where: { id: post.id },
    data: { ...post, userId: post.userId },
  });
  return res.id;
}

export async function deletePost(postid: number) {
  const res = await db.post.delete({ where: { id: postid } });
  return res;
}
