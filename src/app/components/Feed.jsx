import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import Link from "next/link";

export default async function Feed() {
  "use server";
  const { userId } = auth();

  const profileRes = await sql`SELECT * FROM profiles
  WHERE clerk_user_id = ${userId}`;
  const profile_username = profileRes.rows[0].username;

  const posts = await sql`SELECT * FROM posts`;

  return (
    <>
      <div id="feedArea">
        {posts.rows.map((posts) => {
          return (
            <div id="postCard" key={posts.id}>
              <Link href={`/posts/${posts.id}`}>
                <h3>{profile_username}</h3>
                <p>{posts.post_content}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
