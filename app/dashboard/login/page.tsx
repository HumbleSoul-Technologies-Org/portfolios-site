import { redirect } from "next/navigation";

// This page shouldn't be accessed directly - users login at /login.
export default function Page() {
  redirect("/login");
}
