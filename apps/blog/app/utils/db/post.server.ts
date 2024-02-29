import { PostStatus } from "@prisma/client";
import type { Post, Prisma, User } from "@prisma/client";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export interface PostWithUser extends Post {
  user: User;
}

function calculateReadingTime(text: Prisma.JsonObject) {
  let allWordsInPost = "";
  // ? Text is sotred in JSON blocks we need to dig into each block to get all the words
  //@ts-ignore
  text.content?.forEach((element: any) => {
    element.content?.forEach((item: any) => {
      allWordsInPost = `${allWordsInPost} ${item.text}`;
    });
  });

  const words = allWordsInPost.split(" ").length;
  const readingTimeMin = Number(words / 200).toFixed(1);
  const finalReadingTime = Math.round(Number(readingTimeMin));

  return `${finalReadingTime} min read`;
}

export async function getPosts() {
  const posts = await db.post.findMany({
    where: {
      NOT: {
        tags: {
          array_contains: "17",
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });
  return posts as PostWithUser[];
}

export async function getLatestPosts() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
    take: 3,
    where: { published: PostStatus.PUBLISHED },
  });
  return posts as PostWithUser[];
}

export async function getPublishedPosts() {
  const posts = await db.post.findMany({
    where: {
      NOT: {
        tags: {
          array_contains: "17",
        },
      },
      published: PostStatus.PUBLISHED,
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });
  return posts as PostWithUser[];
}

export async function getPublishedWeeknotes() {
  const posts = await db.post.findMany({
    where: {
      tags: {
        array_contains: "17",
      },
      published: PostStatus.PUBLISHED,
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });
  return posts as PostWithUser[];
}

export async function getPostsBySearchQuery(query: string) {
  const posts = await db.post.findMany({
    where: {
      published: PostStatus.PUBLISHED,
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });
  return posts as PostWithUser[];
}

export async function getPostsByTag(tag: string, status?: PostStatus) {
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
      published:
        status === PostStatus.DRAFT
          ? PostStatus.DRAFT || PostStatus.PUBLISHED
          : PostStatus.PUBLISHED,
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });

  return posts as PostWithUser[];
}

export async function getPostBySlug(slug: string) {
  const post = await db.post.findFirst({
    where: {
      slug,
    },
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
