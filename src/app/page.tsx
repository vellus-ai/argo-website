// This file is kept for compatibility. The middleware redirects / to /[defaultLocale].
// If somehow reached without middleware, redirect manually.
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/pt-BR");
}
