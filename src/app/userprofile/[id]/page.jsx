// This is the profiles page for individual users when their username is clicked from anywhere on the site //

import {sql} from "@vercel/postgres";
import Link from "next/link";
import "@/app/styles/userprofile.css";
import {auth} from "@clerk/nextjs";

export default async function UserProfile({params}) {
  const userProfile =
    await sql`SELECT profiles.id, profiles.username, profiles.bio, profiles.location FROM profiles
    WHERE profiles.id = ${params.id}`;
  // posts //
  const userPosts =
    await sql`SELECT posts.id AS post_id, profiles.username, posts.post_title, posts.post_content, profiles.id AS profile_id FROM posts
  JOIN profiles ON posts.user_id = profiles.id
  WHERE profiles.id = ${params.id}`;
  // comments //
  const commentRes = await sql`SELECT posts_id FROM comments`;
  const commentNum = new Map();
  for (const comment of commentRes.rows) {
    const postId = comment.posts_id;
    commentNum.set(postId, (commentNum.get(postId) || 0) + 1);
  }
  const commentNumObject = Object.fromEntries(commentNum);
  // likes //
  const likedRes = await sql`SELECT post_id FROM posts_likes`;
  const likedNum = new Map();
  for (const like of likedRes.rows) {
    const postId = like.post_id;
    likedNum.set(postId, (likedNum.get(postId) || 0) + 1);
  }
  const likedNumObject = Object.fromEntries(likedNum);

  return (
    <div id="userProfileArea">
      <div className="userProfileInfo">
        <h2>{userProfile.rows[0].username}&apos;s Profile</h2>
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
              <p>
                sentiment by{" "}
                <Link href={`/userprofile/${post.profile_id}`}>
                  {post.username}
                </Link>
              </p>
              <div className="postInfo">
                <p className="likes">
                  {likedNumObject[post.post_id] || 0} likes
                </p>
                <p className="comments">
                  {commentNumObject[post.post_id] || 0} thoughts
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
