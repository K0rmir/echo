import {auth} from "@clerk/nextjs";
// import { db } from "@/lib/db";
import {sql} from "@vercel/postgres";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export default function CreatProfile() {
  const {userId} = auth();
  console.log("WEVLJWELKFVJRLKGB");

  async function addNewProfile(formData) {
    "use server";
    const username = formData.get("username");
    const bio = formData.get("bio");
    const location = formData.get("location");

    await sql`INSERT INTO profiles (clerk_user_id, username, bio, location) VALUES (${userId}, ${username}, ${bio}, ${location})`;
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
          required
        />
        <input
          name="location"
          type="text"
          placeholder="What country or city do you live in?"
          required
        />
        <textarea
          name="bio"
          cols="30"
          rows="10"
          type="text"
          placeholder="Tell us about yourself..."
          required></textarea>
        <button>Submit</button>
      </form>
    </div>
  );
}
