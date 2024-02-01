import { Inter } from "next/font/google";
import { ClerkProvider, SignIn, auth } from "@clerk/nextjs";
// import { db } from "@/lib/db";
import { sql } from "@vercel/postgres";
import Header from "@/app/components/Header";
import CreateProfile from "@/app/components/CreateProfile";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Echo",
  description: "Pending",
};

export default async function RootLayout({ children }) {
  // This function goes and gets the clerk_user_id from the db.
  const { userId } = auth();
  console.log(userId);
  const profileResponse =
    await sql`SELECT * FROM profiles WHERE clerk_user_id = ${userId}`;
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header></Header>
          {profileResponse.rowCount !== 0 && children}
          {profileResponse.rowCount === 0 && userId && <CreateProfile />}
          {!userId && <SignIn />}
        </body>
      </html>
    </ClerkProvider>
  );
}
