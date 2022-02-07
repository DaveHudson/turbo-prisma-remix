import { db } from "~/utils/db.server";

export async function checkIfUserExists(username: string) {
  const user = await db.user.findFirst({ where: { username } });
  return !!user;
}
