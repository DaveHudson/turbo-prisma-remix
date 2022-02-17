import {
  ActionFunction,
  Form,
  json,
  Link,
  redirect,
  useActionData,
  useSearchParams,
  useTransition,
} from "remix";
import { SitePromo } from "ui";
import { emailSignup } from "~/utils/db/emaillist.server";

function validateEmail(email: string) {
  if (typeof email !== "string" || email.length < 1) {
    return "Email is required";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const emailSignUpDetails = {
    email: form.get("email") as string,
  };

  const errors = {
    email: validateEmail(emailSignUpDetails.email),
  };

  // Return errors
  if (Object.values(errors).some(Boolean)) {
    return json({ errors, emailSignUpDetails }, { status: 422 }); // Unprocessable entity
  }

  const res = await emailSignup(emailSignUpDetails);
  if (!res) {
    return json({ ...emailSignUpDetails, formError: "Something went wrong" });
  }

  return redirect("/?sent=true");
};

export default function Index() {
  let [searchParams] = useSearchParams();
  let sent = searchParams.get("sent");

  const actionData = useActionData();
  const transition = useTransition();

  //"prose focus:outline-none max-w-none max-w-3xl prose-img:rounded-lg pt-8 first-line:uppercase first-line:tracking-widest tracking-wider first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left dark:prose-invert",

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
            className="decoration-yellow-500 decoration-4 hover:text-sky-500 hover:decoration-solid"
            prefetch="intent"
          >
            build software
          </Link>{" "}
          &amp;{" "}
          <Link
            to="about/lead-teams"
            className="decoration-pink-600 decoration-4 hover:text-sky-500 hover:decoration-solid"
            prefetch="intent"
          >
            lead teams
          </Link>
        </p>
        <div className="flex flex-row justify-center pt-6">
          <div className="flex max-w-2xl flex-col">
            <p className="pt-6 text-xl tracking-wide text-light subpixel-antialiased dark:text-dark">
              Experienced full-stack software engineer, tech lead and certified
              Scrum Master / Product Owner (Scrum Alliance).
            </p>
            <p className="pt-6 text-xl tracking-wide text-light subpixel-antialiased dark:text-dark ">
              I love architecting greenfield web applications and leading small
              delivery teams.
            </p>
          </div>
        </div>
        <SitePromo />
      </div>

      <div className="flex flex-row justify-center">
        <div className="mx-auto py-8 px-4 text-center sm:px-6 lg:py-12 lg:px-8">
          <h2 className="inline text-center text-3xl font-bold tracking-tight text-light dark:text-dark sm:block sm:text-3xl">
            Want blog post updates?
          </h2>
          <p className="text-center text-2xl font-bold tracking-tight text-sky-600 sm:block sm:text-2xl">
            Sign up for the newsletter.
          </p>
          {sent ? (
            <div className="text-2xl">You are signed up, thank you!</div>
          ) : (
            <Form method="post" className="mt-8 sm:flex">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`${
                  actionData?.errors.email
                    ? "block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                    : "block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                }`}
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-sky-600 px-5 py-3 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  {transition.state !== "idle" ? "Submitting..." : "Notify me!"}
                </button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </>
  );
}
