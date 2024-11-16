import Link from "next/link";
import { oxanium } from "./fonts";

export default function ComingSoon() {
  return (
    <div key="1" className="flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1
          className={`${oxanium.className} text-4xl font-bold max-w-2xl text-center p-2 uppercase tracking-wide text-yellow-600`}
        >
          Coming Soon
        </h1>
        <p className="mt-4 text-lg text-neutral-300 ">
          We{"'"}re working hard to bring you something amazing. Stay tuned for
          updates!
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block px-5 py-3 mt-6 text-sm font-bold bg-yellow-600 rounded text-neutral-900 hover:bg-yellow-700 focus:outline-none"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
