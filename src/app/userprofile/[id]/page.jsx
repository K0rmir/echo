// This is the profiles page for individual users when their username is clicked from anywhere on the site //

import {sql} from "@vercel/postgres";
import Link from "next/link";
import "@/app/styles/userprofile.css";

export default async function UserProfile({params}) {
  const userProfile =
    await sql`SELECT profiles.id, profiles.username, profiles.bio, profiles.location FROM profiles
    WHERE profiles.id = ${params.id}`;

  const userPosts =
    await sql`SELECT posts.id AS post_id, profiles.username, posts.post_title, posts.post_content, profiles.id AS profile_id FROM posts
  JOIN profiles ON posts.user_id = profiles.id
  WHERE profiles.id = ${params.id}`;

  const commentRes = await sql`SELECT posts_id FROM comments`;
  const commentNum = new Map();
  for (const comment of commentRes.rows) {
    const postId = comment.posts_id;
    commentNum.set(postId, (commentNum.get(postId) || 0) + 1);
  }
  const commentNumObject = Object.fromEntries(commentNum);

  return (
    <div id="userProfileArea">
      <div className="userProfileInfo">
        <h3>{userProfile.rows[0].username}</h3>
        <p>Location: {userProfile.rows[0].location}</p>
        <p>About:</p>
        <p>{userProfile.rows[0].bio}</p>
      </div>
      <div className="userProfilePosts">
        {userPosts.rows.map((post) => {
          return (
            <div className="postCard" key={post.post_id}>
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
              <div className="postInfo">
                <p>{commentNumObject[post.post_id] || 0} thoughts</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
