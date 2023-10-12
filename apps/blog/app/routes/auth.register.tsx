import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, Form, useNavigation } from "@remix-run/react";

import { checkIfUserExists } from "~/utils/db/user.server";
import { register, createUserSession } from "~/utils/session.server";

function validateUsername(username: string) {
  if (typeof username !== "string" || username.length < 3) {
    return "username should be at least 3 characters long";
  }
}

function validatePassword(password: string) {
  if (typeof password !== "string" || password.length < 3) {
    return "password should be at least 3 characters long";
  }
}

type actionDataType = {
  errors?: {
    username: string;
    password: string;
  },
  userCredentials?: {
    username: string;
    password: string;
  },
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();

  const userCredentials = {
    username: form.get("username") as string,
    password: form.get("password") as string,
  };

  const errors = {
    username: validateUsername(userCredentials.username),
    password: validatePassword(userCredentials.password),
  };

  // Return errors
  if (Object.values(errors).some(Boolean)) {
    return json({ errors, userCredentials }, { status: 422 }); // Unprocessable entity
  }

  const { username, password } = userCredentials;

  const userExists = await checkIfUserExists(username);
  if (userExists) {
    return json({
      ...userCredentials,
      errors: { username: `User ${username} already exists` },
    });
  }

  // Create user
  const user = await register({ username, password });
  if (!user) {
    return json({ ...userCredentials, formError: "Something went wrong" });
  }

  // Create user session
  return createUserSession(user.id, "/posts");
};

export default function Login() {
  const actionData = useActionData<typeof action>() as actionDataType;
  const errors = actionData?.errors;
  const fields = actionData?.userCredentials;
  const transition = useNavigation();

  return (
    <div className="pt-5">
      <Form action="/auth/register" method="POST">
        <label className="text-base font-medium text-light dark:text-dark">
          Register
        </label>
        <fieldset className="mt-4">
          <div className="pt-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-light-accent dark:text-dark-accent"
            >
              username
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="text"
                name="username"
                id="username"
                className={`${
                  errors && errors.username
                    ? "block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                    : "block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                }`}
                defaultValue={fields?.username}
                aria-invalid="true"
                aria-describedby="username-error"
              />
              {errors && errors.username && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-red-600" id="username-error">
              {errors && errors.username && errors && errors.username}
            </p>
          </div>

          <div className="pt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-light-accent dark:text-dark-accent"
            >
              password
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="password"
                name="password"
                id="password"
                className={`${
                  errors && errors.password
                    ? "block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                    : "block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                }`}
                defaultValue={errors && fields?.password}
                aria-invalid="true"
                aria-describedby="password-error"
              />
              {errors && errors.password && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-red-600" id="password-error">
              {errors && errors.password && errors && errors.password}
            </p>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-3 inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                {transition.state !== "idle" ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        </fieldset>
      </Form>
    </div>
  );
}
