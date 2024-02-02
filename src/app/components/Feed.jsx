// Feed component for loading all posts on users homepage //

import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import Link from "next/link";
import "@/app/styles/feedarea.css";

export default async function Feed() {
  "use server";
  const { userId } = auth();

  const profileRes = await sql`SELECT * FROM profiles
  WHERE clerk_user_id = ${userId}`;

  const profile_username = profileRes.rows[0].username;

  const posts =
    await sql`SELECT posts.id AS post_id, profiles.username, posts.post_title, posts.post_content, profiles.id AS profile_id FROM posts
  JOIN profiles ON posts.user_id = profiles.id`;

  // console.log(posts.rows);

  return (
    <>
      <div id="feedArea">
        {posts.rows.map((post) => {
          return (
            <div id="postCard" key={post.post_id}>
              <Link href={`/posts/${post.post_id}`}>
                <h3>{post.post_title}</h3>
              </Link>
              <h4>{post.post_content}</h4>
              <p>
                sentiment by{" "}
                <Link href={`/userprofile/${post.profile_id}`}>
                  {post.username}
                </Link>
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
