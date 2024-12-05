import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = { id: 1, name: "Simerg", email: "simerearchgroup@gmail.com", password: "SIMERG1997!" };

        if (credentials?.email === user.email && credentials?.password === user.password) {
          return user;
        } else {
          return null;
        }

        // if (!credentials?.email || !credentials?.password) {
        //   throw new Error("Invalid credentials");
        // }

        // if (!user || !user?.password) {
        //   throw new Error("Invalid credentials");
        // }

        // const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);

        // if (!isCorrectPassword) {
        //   throw new Error("Invalid credentials");
        // }

        // return user;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
