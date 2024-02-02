// This is the form for adding new posts to the sentiments page //

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";
import { auth } from "@clerk/nextjs";
import "@/app/styles/newpostform.css";
import AddNewPostToast from "@/app/components/AddNewPostToast";

export default async function NewPostForm() {
  const { userId } = auth();
  // get the row in the db where userId is the clerk_user_id
  const profileRes = await sql`SELECT * FROM profiles 
  WHERE clerk_user_id = ${userId}`;
  const profile_id = profileRes.rows[0].id;

  // function to add new posts //
  async function handleAddPost(formData) {
    "use server";
    const postTitle = formData.get("title");
    const postContent = formData.get("content");

    await sql`INSERT INTO posts (post_title, post_content, user_id)
    VALUES (${postTitle}, ${postContent}, ${profile_id})`;

    revalidatePath("/");
  }

  return (
    <div id="formContainer">
      <form action={handleAddPost}>
        <input
          name="title"
          id="title"
          type="text"
          placeholder="Title your sentiment"
          required
        />
        <textarea
          name="content"
          id="content"
          cols="100"
          rows="5"
          placeholder="Detail your sentiment..."
          required
        ></textarea>
        <AddNewPostToast />
      </form>
    </div>
  );
}
