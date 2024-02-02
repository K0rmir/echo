// This is the form for adding new posts to the sentiments page //

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";
import { auth } from "@clerk/nextjs";
import "@/app/styles/newpostform.css";
import AddNewPostFormBtn from "@/app/components/AddNewPostFormBtn";

export default async function NewPostForm() {
  const { userId } = auth();
  // get the row in the db where userId is the clerk_user_id
  const profileRes = await sql`SELECT * FROM profiles 
  WHERE clerk_user_id = ${userId}`;
  const profile_id = profileRes.rows[0].id;

  // function to add new posts //
  async function handleAddPost(formData) {
    "use server";
    const postContent = formData.get("content");

    await sql`INSERT INTO posts (post_content, user_id)
    VALUES (${postContent}, ${profile_id})`;

    revalidatePath("/");
  }

  return (
    <div id="formContainer">
      <form action={handleAddPost}>
        <textarea
          name="content"
          id="content"
          cols="100"
          rows="5"
          placeholder="Share a sentiment..."
        ></textarea>
        <AddNewPostFormBtn />
      </form>
    </div>
  );
}
