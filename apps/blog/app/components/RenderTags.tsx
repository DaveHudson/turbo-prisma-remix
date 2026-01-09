import { Link } from "@remix-run/react";

type Tag = {
  id: number;
  name: string;
  color: string;
};

export default function RenderTags({
  tags,
  dbTags,
}: {
  tags: [];
  dbTags: Tag[];
}) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2 pt-3">
      {tags.map((tag) => {
        const selectedTag = dbTags.find((x) => x.id === Number(tag));
        return (
          <Link
            key={tag}
            to={`/tags/${selectedTag?.name}`}
            className={`no-underline text-${selectedTag?.color}-800`}
          >
            <span
              className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-${selectedTag?.color}-100 hover:underline hover:underline-offset-2`}
            >
              {selectedTag?.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
