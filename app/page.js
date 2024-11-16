import { authOptions } from "./api/auth/[...nextauth]/route.js";
import { getServerSession } from "next-auth";
import HomePage from "../components/HomePage.js";
import UserCard from "../components/UserCard.js";
import Logout from "../components/Logout.js";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {session ? (
        <>
          <HomePage />
          <UserCard user={session?.user}></UserCard>
          <Logout />
        </>
      ) : (
        <HomePage />
      )}
    </>
  );
}
