import { Link } from "remix";

export default function SitePromo() {
  return (
    <div className="mx-auto max-w-5xl py-16 px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-gray-800 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
        <div className="px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
          <div className="lg:self-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">This site is open source!</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-sky-200">
              Find out how this site was made with 😊 using Remix, Prisma,
              Tailwind CSS, TurboRepo and Fly
            </p>
            <Link
              to="posts/remixing-this-blog"
              className="mt-8 inline-flex items-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-sky-600 shadow hover:bg-sky-50"
            >
              Find out more
            </Link>
          </div>
        </div>
        <div className="aspect-w-5 aspect-h-3 -mt-6 md:aspect-w-2 md:aspect-h-1">
          <img
            className="translate-x-6 translate-y-6 transform rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
            src="/app-preview.jpg"
            alt="App screenshot"
          />
        </div>
      </div>
    </div>
  );
}
