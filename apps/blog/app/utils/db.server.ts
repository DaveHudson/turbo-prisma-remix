import type { PrismaClient as PrismaClientType } from "@prisma/client";
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;

let db: PrismaClientType;

declare global {
  var __db: PrismaClientType | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  db = global.__db;
}

export { db };
