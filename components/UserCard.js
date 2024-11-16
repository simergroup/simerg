import Image from "next/image";

export default function UserCard({ user }) {
  const greeting = user?.name ? `Hello, ${user.name}!` : null;

  const emailDisplay = user?.email ? `Email: ${user.email}!` : null;

  const userImage = user?.image ? (
    <Image src={user?.image} alt={user?.name ?? "Profile Pic"} width={200} height={200} priority={true} />
  ) : null;

  return (
    <section className="border-2 border-red">
      {greeting}
      {emailDisplay}
      {userImage}
    </section>
  );
}
