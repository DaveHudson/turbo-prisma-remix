import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { Message } from "@prisma/client";
import {
  ActionFunction,
  Form,
  json,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { createEnquiry } from "~/utils/db/contact.server";
import { useSearchParams } from "remix";

function validateName(name: string) {
  if (typeof name !== "string" || name.length < 1) {
    return "Name required";
  }
}

function validateEmail(email: string) {
  if (typeof email !== "string" || email.length < 1) {
    return "Email required";
  }
}

function validateMessage(message: string) {
  if (typeof message !== "string" || message.length < 1) {
    return "Message required";
  }
}

export const action: ActionFunction = async ({ request }) => {
  // Grab form data
  const form = await request.formData();

  const name = form.get("name");
  const email = form.get("email");
  const message = form.get("message");
  const second_name = form.get("second_name");

  // honey pot form
  if (second_name) {
    return redirect("/contact?sent=true");
  }

  const enquiry = {
    name,
    email,
    message,
  } as Message;

  const errors = {
    name: validateName(enquiry.name),
    email: validateEmail(enquiry.email),
    message: validateMessage(enquiry.message),
  };

  // Return errors
  if (Object.values(errors).some(Boolean)) {
    return json({ errors, enquiry }, { status: 422 });
  }

  await createEnquiry(enquiry);

  return redirect("/contact?sent=true");
};

export default function Contact() {
  let [searchParams] = useSearchParams();
  let sent = searchParams.get("sent");

  const actionData = useActionData();
  const transition = useTransition();

  return (
    <div className="relative">
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/2" />
      </div>
      <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-5">
        <div className="py-16 px-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
          <div className="mx-auto max-w-lg">
            <h2 className="text-2xl font-extrabold tracking-tight text-light dark:text-dark sm:text-3xl">
              Get in touch
            </h2>
            <p className="mt-3 text-lg leading-6 text-gray-500">
              I'm always happy to be contacted about work opportunities or
              random enquiries. If you'd like to do so just use this form.
            </p>
          </div>
        </div>
        <div className="py-16 px-4 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12">
          <div className="mx-auto max-w-lg lg:max-w-none">
            {sent ? (
              <div className="text-2xl">Message received, thank you!</div>
            ) : (
              <Form method="post" className="grid grid-cols-1 gap-y-6">
                <div className="relative mt-1 rounded-md shadow-sm">
                  <label htmlFor="name" className="sr-only">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    className={`${
                      actionData?.errors.name
                        ? "focus:ring-red-500m block w-full rounded-md border-red-300 py-3 px-4 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none"
                        : "block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    }`}
                    placeholder="Full name"
                  />
                  {actionData?.errors.name && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {actionData?.errors.name && (
                  <p className="text-sm text-red-600" id="name-error">
                    {actionData?.errors.name && actionData?.errors.name}
                  </p>
                )}

                <div className="hidden">
                  <label htmlFor="name" className="sr-only">
                    Second name
                  </label>
                  <input
                    type="text"
                    name="second_name"
                    id="second_name"
                    placeholder="Second name"
                  />
                </div>

                <div className="relative mt-1 rounded-md shadow-sm">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`${
                      actionData?.errors.email
                        ? "focus:ring-red-500m block w-full rounded-md border-red-300 py-3 px-4 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none"
                        : "block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    }`}
                    placeholder="Email"
                  />
                  {actionData?.errors.name && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {actionData?.errors.email && (
                  <p className="text-sm text-red-600" id="email-error">
                    {actionData?.errors.email && actionData?.errors.email}
                  </p>
                )}

                <div className="relative mt-1 rounded-md shadow-sm">
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className={`${
                      actionData?.errors.message
                        ? "focus:ring-red-500m block w-full rounded-md border-red-300 py-3 px-4 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none"
                        : "block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    }`}
                    placeholder="Message"
                    defaultValue={""}
                  />
                  {actionData?.errors.name && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {actionData?.errors.message && (
                  <p className="text-sm text-red-600" id="message-error">
                    {actionData?.errors.message && actionData?.errors.message}
                  </p>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    {transition.state !== "idle"
                      ? "Submitting message..."
                      : "Send message"}
                  </button>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
