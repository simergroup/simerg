"use client";

import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <button onClick={() => signOut()} className="text-red-600 transition-colors hover:text-red-700">
      Logout
    </button>
  );
}
