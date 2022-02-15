import { Link, useLoaderData, useSearchParams } from "remix";
import type { LoaderFunction } from "remix";
import {
  getPosts,
  getPostsBySearchQuery,
  getPublishedPosts,
  PostWithUser,
} from "~/utils/db/post.server";
import dayjs from "dayjs";
import { getTags } from "~/utils/db/tag.server";
import { Tag } from "@prisma/client";
import RenderTags from "~/components/RenderTags";
import { getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  let url = new URL(request.url);
  let search = url.searchParams.get("search");

  let posts;
  if (search) {
    posts = await getPostsBySearchQuery(search);
  } else {
    if (user?.id === 1) {
      posts = await getPosts();
    } else {
      posts = await getPublishedPosts();
    }
  }

  const tags = await getTags();

  const data = { posts, tags };
  return data;
};

export default function Posts() {
  let [searchParams] = useSearchParams();
  let search = searchParams.get("search");

  const { posts, tags } =
    useLoaderData<{ posts: PostWithUser[]; tags: Tag[] }>();

  return (
    <div className="px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-14">
      <div className="relative mx-auto max-w-lg divide-y-2 divide-gray-200 lg:max-w-7xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-light dark:text-dark sm:text-4xl">
            {search ? `Search results for "${search}"` : "My latest thoughts"}
          </h2>
          <p className="mt-3 text-xl sm:mt-4">
            I have a brain like a sieve. These posts are reminders to myself
            about solutions I've implemented, if others find them useful too I
            consider that a win!
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
              <p className="mt-3 text-base  ">{post.description}</p>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <span className="sr-only">{post.user.name}</span>
                  <img
                    className="h-10 w-10 rounded-full"
                    src={post.user.profileUrl!}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-light dark:text-dark">
                    {post.user.name}
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
