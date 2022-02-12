import { Link } from "remix";

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
    <div className="flex justify-center space-x-3 pt-3">
      {tags.map((tag) => {
        const selectedTag = dbTags.find((x) => x.id === Number(tag));
        return (
          <span
            key={tag}
            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-${selectedTag?.color}-100`}
          >
            <Link
              to={`/tags/${selectedTag?.name}`}
              className={`no-underline text-${selectedTag?.color}-800`}
            >
              {selectedTag?.name}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
