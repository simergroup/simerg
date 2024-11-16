"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";

export default function UserCard({ user }) {
  const greeting = user?.name ? `${user.name}` : null;

  const emailDisplay = user?.email ? `${user.email}` : null;

  const userImage = user?.image ? (
    <Image
      src={user?.image}
      className="rounded-full"
      alt={user?.name ?? "Profile Pic"}
      width={50}
      height={50}
      priority={true}
    />
  ) : null;

  return (
    <div className="flex items-center space-x-4 border-red w-fit">
      <div>
        <p className="text-white">{greeting}</p>
        <p className="text-white">{emailDisplay}</p>
        <button onClick={() => signOut()} className="text-red-600 transition-colors hover:text-red-700">
          Logout
        </button>
      </div>
      {userImage}
    </div>
  );
}
