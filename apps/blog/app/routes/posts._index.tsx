import type {
  PostWithUser} from "~/utils/db/post.server";
import {
  getPosts,
  getPostsBySearchQuery,
  getPublishedPosts
} from "~/utils/db/post.server";
import dayjs from "dayjs";
import { getTags } from "~/utils/db/tag.server";
import type { Tag, User} from "@prisma/client";
import { PostStatus } from "@prisma/client";
import RenderTags from "~/components/RenderTags";
import { getUser } from "~/utils/session.server";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useSearchParams, useLoaderData, Link } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const user = (await getUser(request)) as User;

  let url = new URL(request.url);
  let search = url.searchParams.get("search");

  let posts:PostWithUser[];
  if (search) {
    posts = await getPostsBySearchQuery(search);
  } else {
    if (user && user?.id === 1) {
      posts = await getPosts() as PostWithUser[];
    } else {
      posts = await getPublishedPosts() as PostWithUser[];
    }
  }

  const tags = await getTags() as Tag[];

  return json({ posts, tags });

};

export default function Posts() {
  let [searchParams] = useSearchParams();
  let search = searchParams.get("search");

  const { posts, tags } = useLoaderData<{
    posts: PostWithUser[];
    tags: Tag[];
  }>();

  return (
    <div className="px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-14">
      <div className="relative mx-auto max-w-lg divide-y-2 divide-gray-200 lg:max-w-7xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-light dark:text-dark sm:text-4xl">
            {search ? `Search results for "${search}"` : "My latest thoughts"}
          </h2>
          <p className="mt-3 text-xl sm:mt-4">
            These posts serve as my digital Post-it notes, not just for tech
            solutions I've implemented, but also for thoughts and musings I
            don't want slipping through the cracks. If you find them handy too,
            well, that's a proper win!
          </p>
        </div>
        <div className="mt-12 grid gap-16 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
          {posts.map((post) => (
            <div key={post.id}>
              <Link to={`${post.slug}`} className="mt-4 block">
                <p className="text-xl font-semibold text-light dark:text-dark">
                  {post.title}
                </p>
              </Link>
              <p className="mt-3 text-base">{post.description}</p>
              {post.published === PostStatus.DRAFT && (
                <span className="mt-2 inline-flex items-center rounded bg-neutral-700 px-2 py-0.5 text-xs font-medium text-neutral-200">
                  <svg
                    className="mr-1.5 h-2 w-2 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx={4} cy={4} r={3} />
                  </svg>
                  Draft
                </span>
              )}
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <span className="sr-only">{post?.user?.name}</span>
                  {post?.user?.profileUrl && <img
                    className="h-10 w-10 rounded-full"
                    src={post.user.profileUrl!}
                    alt=""
                  />}                  
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-light dark:text-dark">
                    {post?.user?.name}
                  </p>
                  <div className="flex space-x-1 text-sm">
                    <time
                      dateTime={dayjs(post.createdAt).format("MMM D, YYYY")}
                    >
                      {dayjs(post.createdAt).format("MMM D, YYYY")}
                    </time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.readingTime} read</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-start pt-2">
                <RenderTags tags={post.tags as []} dbTags={tags} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
