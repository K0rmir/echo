import {auth} from "@clerk/nextjs";
import {sql} from "@vercel/postgres";
// import {revalidatePath} from "next/cache";
import "@/app/styles/repostButton.css";

export default async function RepostButton({post_id}) {
  // query to get profile info //
  const {userId} = auth();
  const profileRes = await sql`SELECT * FROM profiles
  WHERE clerk_user_id = ${userId}`;
  const profile_id = profileRes.rows[0].id;

  async function handleRepost() {
    "use server";

    await sql`INSERT INTO reposts (user_id, post_id)
    VALUES (${profile_id}, ${post_id})`;
  }

  return (
    <form action={handleRepost}>
      <button className="repostButton">Echo this Sentiment</button>
    </form>
  );
}
