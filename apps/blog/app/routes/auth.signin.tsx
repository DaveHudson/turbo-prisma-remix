import { LockClosedIcon } from "@heroicons/react/24/outline";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import { login, createUserSession } from "~/utils/session.server";

function validateUsername(username: string) {
  if (typeof username !== "string" || username.length < 3) {
    return "username should be at least 3 characters long";
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

function validatePassword(password: string) {
  if (typeof password !== "string" || password.length < 3) {
    return "password should be at least 3 characters long";
  }
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

  // Find user
  const user = await login({ username, password });
  // Check user
  if (!user) {
    return json({
      ...userCredentials,
      errors: { username: "Invalid credentials" },
    });
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
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Form action="/auth/signin" method="POST" className="mt-8 space-y-6">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>

              <input
                id="username"
                name="username"
                type="text"
                className={`${
                 errors && errors.username
                    ? "relative block w-full appearance-none rounded-none rounded-t-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-300 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                    : "relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                }`}
                defaultValue={fields?.username}
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`${
                  errors && errors.username
                    ? "relative block w-full appearance-none rounded-none rounded-b-md border border-red-300 px-3 py-2 text-red-900 placeholder-red-300 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                    : "relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                }`}
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-sky-500 group-hover:text-sky-400"
                  aria-hidden="true"
                />
              </span>
              {transition.state !== "idle" ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
