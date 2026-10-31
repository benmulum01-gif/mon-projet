import { notFound } from "next/navigation";

/** Unknown paths under /en or /fr render the localized 404 page. */
export default function CatchAll() {
  notFound();
}
