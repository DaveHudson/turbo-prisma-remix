import { Link } from "remix";

export default function Index() {
  const techstack = [
    {
      id: 1,
      title: "Remix (React)",
      description:
        "A full stack framework focused on web fundamentals and modern UX.",
      url: "/tags/remix",
    },
    {
      id: 2,
      title: "Tailwind CSS",
      description:
        "A utility-first CSS framework to rapidly build modern websites without ever leaving HTML",
      url: "/tags/tailwind",
    },
    {
      id: 3,
      title: "Prisma",
      description:
        "TypeScript ORM for PostgreSQL MySQL & MongoDB to build faster and with fewer errors",
      url: "/tags/prisma",
    },
    {
      id: 4,
      title: "Cypress + Testing Library",
      description:
        "Fast, easy and reliable testing for anything that runs in a browser",
      url: "/tags/cypress",
    },
  ];

  return (
    <>
      <div className="p-4">
        <p className="text-center text-3xl font-bold tracking-wide text-light subpixel-antialiased dark:text-dark md:text-4xl lg:text-5xl">
          My name is Dave Hudson
        </p>
        <p className="pt-2 text-center text-2xl tracking-wide subpixel-antialiased md:text-3xl lg:text-4xl">
          I{" "}
          <Link
            to="about/build-software"
            className="underline decoration-yellow-500 decoration-4 underline-offset-2 hover:underline-offset-4"
            prefetch="intent"
          >
            build software
          </Link>{" "}
          &amp;{" "}
          <Link
            to="about/lead-teams"
            className="underline decoration-pink-600 decoration-4 underline-offset-2 hover:underline-offset-4"
            prefetch="intent"
          >
            lead teams
          </Link>
        </p>
        <div className="flex flex-row justify-center pt-6">
          <div className="flex max-w-2xl flex-col">
            <p className="pt-6 text-lg tracking-wide text-light subpixel-antialiased dark:text-dark">
              I'm an experienced software engineer, technical lead and certified
              Scrum Master / Product Owner (Scrum Alliance).
            </p>
            <p className="pt-6 text-lg tracking-wide text-light subpixel-antialiased dark:text-dark">
              My sweet spot is architecting greenfield web applications and
              leading small teams to deliver.
            </p>

            <p className="text-md pt-6 tracking-wide subpixel-antialiased">
              Preferred tech stack:
            </p>

            <div className="mt-6 flow-root">
              <ul
                role="list"
                className="-my-5 ml-4 mr-4 divide-y divide-gray-300 dark:divide-gray-50"
              >
                {techstack.map((tech) => (
                  <li key={tech.id} className="py-5">
                    <div className="relative focus-within:ring-2 focus-within:ring-sky-500">
                      <h3 className="text-md font-semibold text-light dark:text-dark">
                        <Link
                          to={tech.url}
                          className="hover:underline focus:outline-none"
                        >
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          {tech.title}
                        </Link>
                      </h3>
                      <p className="text-md mt-1 line-clamp-2">
                        {tech.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center">
        <div className="mx-auto py-12 px-4 text-center sm:px-6 lg:py-16 lg:px-8">
          <h2 className="inline text-center text-3xl font-bold tracking-tight text-light dark:text-dark sm:block sm:text-3xl">
            Want blog post updates?
          </h2>
          <p className="text-center text-2xl font-bold tracking-tight text-sky-600 sm:block sm:text-2xl">
            Sign up for the newsletter.
          </p>
          <form className="mt-8 sm:flex">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md border-gray-300 px-5 py-3 placeholder-gray-500 focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs"
              placeholder="Enter your email"
            />
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-sky-600 px-5 py-3 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Notify me!
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
