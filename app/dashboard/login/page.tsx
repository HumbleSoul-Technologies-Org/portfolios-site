import { redirect } from "next/navigation";

export default function Page() {
  // Server-side redirect that points to the top-level login page.
  redirect('/login');
}

