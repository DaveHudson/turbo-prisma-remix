import { Tag } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function getTags() {
  const tags = await db.tag.findMany({
    orderBy: { name: "asc" },
  });

  return tags as Tag[];
}
