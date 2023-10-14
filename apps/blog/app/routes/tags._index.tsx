import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getTags } from "~/utils/db/tag.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    tags: await getTags(),
  });
}

export default function TagList() {
  const { tags } = useLoaderData<typeof loader>();

  return (
    <>
      <p>Need to list all tags and colours so they get inserted into the CSS</p>
      <div className="flex justify-center space-x-3 pt-3">
        {tags.map((tag) => (
          <span
            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-${tag.color}-100`}
          >
            <Link
              to={`/tags/${tag.name}`}
              className={`no-underline text-${tag.color}-800`}
            >
              {tag.name}
            </Link>
          </span>
        ))}
      </div>
      <div className="flex justify-center space-x-3 pt-3">
        <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
          Remix
        </span>
        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          React
        </span>
        <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          Tailwind
        </span>
        <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
          Testing
        </span>
        <span className="inline-flex items-center rounded bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800">
          React Native
        </span>
        <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
          PWA
        </span>
        <span className="inline-flex items-center rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
          Design
        </span>
        <span className="inline-flex items-center rounded bg-lime-100 px-2 py-0.5 text-xs font-medium text-lime-800">
          DevOps
        </span>
        <span className="inline-flex items-center rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
          Git
        </span>
        <span className="inline-flex items-center rounded bg-fuchsia-100 px-2 py-0.5 text-xs font-medium text-fuchsia-800">
          AWS Amplify
        </span>
        <span className="inline-flex items-center rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
          TypeScript
        </span>
        <span className="inline-flex items-center rounded bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-800">
          Delivery
        </span>
        <span className="inline-flex items-center rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-800">
          AI
        </span>
      </div>
    </>
  );
}
