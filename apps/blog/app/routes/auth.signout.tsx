import { redirect } from "@remix-run/node";
import { logout } from "~/utils/session.server";

export const action = async ({ request }: { request: Request }) => {
  return logout(request);
};

export const loader = async () => {
  return redirect("/");
};
