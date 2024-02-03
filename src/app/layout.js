import { Playfair } from "next/font/google";
import { ClerkProvider, SignIn, auth } from "@clerk/nextjs";
// import { db } from "@/lib/db";
import { sql } from "@vercel/postgres";
import Header from "@/app/components/Header";
import CreateProfile from "@/app/components/CreateProfile";
import "./globals.css";

const playfair = Playfair({ 
  weight: ['400', '600', '800'],
  subsets: ["latin"] });

export const metadata = {
  title: "Echo",
  description: "A place for sentiments",
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
        <body className={playfair.className}>
          <Header></Header>
          {profileResponse.rowCount !== 0 && children}
          {profileResponse.rowCount === 0 && userId && <CreateProfile />}
          {!userId && <SignIn />}
        </body>
      </html>
    </ClerkProvider>
  );
}
