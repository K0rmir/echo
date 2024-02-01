import { auth } from "@clerk/nextjs";
// import { db } from "@/lib/db";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function CreatProfile() {
  const { userId } = auth();
  console.log("WEVLJWELKFVJRLKGB");

  async function addNewProfile(formData) {
    "use server";
    const username = formData.get("username");
    const bio = formData.get("bio");

    await sql`INSERT INTO profiles (clerk_user_id, username, bio) VALUES (${userId}, ${username}, ${bio})`;
    revalidatePath("/");
    redirect("/");
  }

  return (
    <div className="createProfileForm">
      <form action={addNewProfile}>
        <input
          name="username"
          type="text"
          placeholder="What do you like to be known as?"
        />
        <textarea
          name="bio"
          cols="30"
          rows="10"
          type="text"
          placeholder="Tell us about yourself..."
        ></textarea>
        <button>Submit</button>
      </form>
    </div>
  );
}
