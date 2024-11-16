import Link from "next/link";
import { oxanium } from "../utils/fonts";

export default function NotFound() {
  return (
    <div className="flex items-center px-4 mx-auto">
      <div className={`${oxanium.className} text-center`}>
        <h1 className="font-black text-9xl text-neutral-300">404</h1>

        <p className="text-2xl font-bold tracking-tight text-neutral-300 sm:text-4xl">
          Uh-oh!
        </p>

        <p className="mt-4 text-neutral-500">We can{"'"}t find that page.</p>

        <Link
          href="/"
          className="inline-block px-5 py-3 mt-6 text-sm font-bold bg-yellow-600 rounded text-neutral-900 hover:bg-yellow-700 focus:outline-none"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
