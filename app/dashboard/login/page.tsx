import { redirect } from "next/navigation";

// This page shouldn't be accessed - users login at /login not /dashboard/login
// This redirect ensures anyone trying to access it goes to the main login page
export default function Page() {
  redirect('/dashboard');
}

