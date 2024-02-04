// This is the form for adding new comments to a post/sentiment //

import {Revalidate, revalidatePath} from "next/cache";
import {sql} from "@vercel/postgres";
import {auth} from "@clerk/nextjs";
import AddNewCommentToast from "@/app/components/AddNewCommentToast";
import "@/app/styles/newcommentform.css";

export default async function NewCommentForm({params}) {
  const {userId} = auth();
  const profileRes = await sql`SELECT * from profiles
    WHERE clerk_user_id = ${userId}`;
  const profile_id = profileRes.rows[0].id;

  // function to add new comments //

  async function handleAddNewComment(formData) {
    "use server";
    const commentContent = formData.get("content");

    await sql`INSERT INTO comments (comment_content, posts_id, profiles_id)
        VALUES (${commentContent}, ${params.id}, ${profile_id})`;

    revalidatePath(`/posts/${params.id}`);
  }

  return (
    <div id="commentFormContainer">
      <form action={handleAddNewComment}>
        <textarea
          name="content"
          id="content"
          cols="55"
          rows="5"
          required></textarea>
        <AddNewCommentToast />
      </form>
    </div>
  );
}
