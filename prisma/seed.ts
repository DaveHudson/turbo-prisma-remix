import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  // USERS
  const dave = await prisma.user.create({
    data: {
      username: "David",
      // this is a hashed version of "twixrox"
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
      name: "Dave",
      profileUrl: "https://cdn-images-1.medium.com/fit/c/160/160/1*Ael8x_sr6DYrrFQda45_4w@2x.jpeg",
    },
  });

  const scarlett = await prisma.user.create({
    data: {
      username: "Scarlett",
      // this is a hashed version of "twixrox"
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
      name: "Dave",
      profileUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  });

  // POSTS
  await Promise.all(
    getPosts().map((post) => {
      const data = { userId: dave.id, ...post };
      return prisma.post.create({ data });
    })
  );
}

seed();

function getPosts() {
  return [
    {
      title: "Boost your conversion rate",
      description: "This is a description",
      body: "Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.",
      readingTime: "3 min read",
      tags: [
        {
          name: "Remix",
          color: "bg-red-100 text-red-800",
        },
        {
          name: "React",
          color: "bg-blue-100 text-blue-800",
        },
      ],
    },
    {
      title: "Boost your conversion rate 1",
      description: "This is a description",
      body: "Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.",
      readingTime: "3 min read",
      tags: [
        {
          name: "Remix",
          color: "bg-red-100 text-red-800",
        },
        {
          name: "React",
          color: "bg-blue-100 text-blue-800",
        },
      ],
    },
    {
      title: "Boost your conversion rate 2",
      description: "This is a description",
      body: "Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.",
      readingTime: "3 min read",
      tags: [
        {
          name: "Remix",
          color: "bg-red-100 text-red-800",
        },
        {
          name: "React",
          color: "bg-blue-100 text-blue-800",
        },
        {
          name: "Tailwind",
          color: "bg-green-100 text-green-800",
        },
      ],
    },
  ];
}
