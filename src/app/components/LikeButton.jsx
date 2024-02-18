import {auth} from "@clerk/nextjs";
import {sql} from "@vercel/postgres";
import {revalidatePath} from "next/cache";
import {PlusCircledIcon} from "@radix-ui/react-icons";
import "@/app/styles/likebutton.css";

export default async function LikeButton({post_id}) {
  // query to get profile info //
  const {userId} = auth();
  const profileRes = await sql`SELECT * FROM profiles
  WHERE clerk_user_id = ${userId}`;
  const profile_id = profileRes.rows[0].id;

  // query to get likes from post likes table by the post_id and profile_id //
  const likedRes =
    await sql`SELECT * FROM posts_likes WHERE post_id = ${post_id} AND profile_id = ${profile_id}`;
  // this checks whether or not the post has been liked //
  const liked = likedRes.rows.length === 0 ? false : true;

  async function handleLike() {
    "use server";

    if (liked === false) {
      await sql`INSERT INTO posts_likes (profile_id, post_id)
      VALUES (${profile_id}, ${post_id})`;
      revalidatePath(`/posts/${post_id}`);
    }
  }

  return (
    <form action={handleLike}>
      <button className="likeButton">
        Like this Sentiment <PlusCircledIcon />
      </button>
    </form>
  );
}
