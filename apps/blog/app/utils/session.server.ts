import bcrypt from "bcrypt";
import { db } from "./db.server";
import { createCookieSessionStorage, redirect } from "remix";
import { User } from "@prisma/client";

type loginType = {
  username: string;
  password: string;
};

export async function login({ username, password }: loginType) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return user;
}

// Register a new user
export async function register({ username, password }: loginType) {
  const user = await db.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  return user;
}

// Get session secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("No session secret");
}

// Create Session Storage
const storage = createCookieSessionStorage({
  cookie: {
    name: "remix-blog-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1
    httpOnly: true,
  },
});

// Create Session
export async function createUserSession(userId: number, readirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(readirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// Get user session
export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// Get user
export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") {
    return null;
  }

  try {
    const user = (await db.user.findUnique({
      where: {
        id: userId,
      },
    })) as User;

    return user;
  } catch (error) {
    return null;
  }
}

// Log out user and destroy session cookie
export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/auth/signout", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
