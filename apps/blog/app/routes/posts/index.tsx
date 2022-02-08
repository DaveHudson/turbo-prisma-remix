import { Link, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { getPosts, PostWithUser } from "~/utils/db/post.server";
import dayjs from "dayjs";

// TODO: implement full category tags
// category: { name: "Case Study", href: "#", color: "bg-green-100 text-green-800" },

export const loader: LoaderFunction = async () => {
  const dbPosts = getPosts();

  return dbPosts;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Posts() {
  const posts = useLoaderData<PostWithUser[]>();

  return (
    <div className="px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-14">
      <div className="relative mx-auto max-w-lg divide-y-2 divide-gray-200 lg:max-w-7xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-light dark:text-dark sm:text-4xl">
            Recent publications
          </h2>
          <p className="mt-3 text-xl sm:mt-4">
            Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat
            massa dictumst amet. Sapien tortor lacus arcu.
          </p>
        </div>
        <div className="mt-12 grid gap-16 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
          {posts.map((post) => (
            <div key={post.title}>
              {/* <div>
                <Link to={`${post.category}`} className="inline-block">
                  <span
                  className={classNames(
                    post.category.color,
                    "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium"
                  )}
                  >
                    {post.category}
                  </span>
                </Link>
              </div> */}
              <Link to={`${post.id}`} className="mt-4 block">
                <p className="text-xl font-semibold text-light dark:text-dark">
                  {post.title}
                </p>
                <p className="mt-3 text-base  ">{post.description}</p>
              </Link>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <Link to={`${post.user.id}`}>
                    <span className="sr-only">{post.user.name}</span>
                    <img
                      className="h-10 w-10 rounded-full"
                      src={post.user.profileUrl!}
                      alt=""
                    />
                  </Link>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-light dark:text-dark">
                    <Link to={`${post.user.id}`}>{post.user.name}</Link>
                  </p>
                  <div className="flex space-x-1 text-sm">
                    <time
                      dateTime={dayjs(post.createdAt).format("MMM D, YYYY")}
                    >
                      {post.createdAt}
                    </time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.readingTime} read</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
