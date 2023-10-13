import  type { Page, User, Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export interface PageWithUser extends Page {
  user: User;
}

export async function getPageBySlug(slug: string) {
  const page = await db.page.findFirst({
    where: {
      slug,
    },
    include: {
      user: true,
    },
  });

  if (!page) throw new Error("Page by slug not found");

  const pageData = {
    ...page,
  };

  return pageData as PageWithUser;
}

export async function getPage(pageid: number) {
  const page = await db.page.findUnique({
    where: { id: pageid },
    include: {
      user: true,
    },
  });

  if (!page) throw new Error("Page not found");

  const pageData = {
    ...page,
  };

  return pageData as PageWithUser;
}

export async function updatePage(fields: Page) {
  const body = fields.body as Prisma.JsonObject;
  invariant(body, "expected body to exits");

  const page = {
    ...fields,
    id: fields.id as number,
    body: body as Prisma.JsonObject,
  };

  const res = await db.page.update({
    where: { id: page.id },
    data: { ...page, userId: page.userId },
  });
  return res.id;
}
