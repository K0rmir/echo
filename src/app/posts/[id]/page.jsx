// Functionality and rendering for individual posts when clicking through to them to see all comments.

import { sql } from "@vercel/postgres";
import { Revalidate } from "next/dist/server/lib/revalidate";
import { Redirect } from "next";
import { auth } from "@clerk/nextjs";
import NewCommentForm from "@/app/components/newCommentForm";

export default async function individualPost({ params }) {
  "use server";
  const { userId } = auth();
  const profileRes = await sql`SELECT * FROM profiles
  WHERE clerk_user_id = ${userId}`;
  const profile_username = profileRes.rows[0].username;

  const posts = await sql`SELECT * FROM posts  
  WHERE posts.id = ${params.id}`;

  //   db query here to GET all entries from comments table.

  return (
    <div id="individualPostContainer">
      <div id="individualPostContent">
        <h3 className="username">{profile_username}</h3>
        <p className="content">{posts.rows[0].post_content}</p>
      </div>
      <div id="commentsArea">
        <NewCommentForm params={params} />
        {/* map here to map through comments */}
      </div>
    </div>
  );
}
