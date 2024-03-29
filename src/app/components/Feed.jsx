// Feed component for loading all posts on users homepage //

import {auth} from "@clerk/nextjs";
import {sql} from "@vercel/postgres";
import Link from "next/link";
import "@/app/styles/feedarea.css";

export default async function Feed() {
  "use server";
  const {userId} = auth();

  // query to get all data from profiles table //

  const profileRes = await sql`SELECT * FROM profiles
  WHERE clerk_user_id = ${userId}`;
  const profile_username = profileRes.rows[0].username;
  // query to get data from posts table //
  const posts =
    await sql`SELECT posts.id AS post_id, profiles.username, posts.post_title, posts.post_content, profiles.id AS profile_id, NULL AS repost_id FROM posts
  JOIN profiles ON posts.user_id = profiles.id
  UNION ALL
  
  SELECT posts.id AS post_id,
  profiles.username,
  posts.post_title,
  posts.post_content,
  profiles.id AS profile_id,
  reposts.id AS repost_id

  FROM posts
  JOIN reposts ON posts.id = reposts.post_id
  JOIN profiles ON reposts.user_id = profiles.id`;

  console.table(posts.rows);

  // query to get comments from comments table and display total comments per post //
  const commentRes = await sql`SELECT posts_id FROM comments`;

  // I came to the below conclusion for rendering total comments on individual posts on the feed after a lot of googleing & stackoverflow. I eventually used Google Bard to help find the solution.
  // I have never used the Map object before. It's fuckin' sick. I've left comments to try and demonstrate my understanding of what's happening.

  // This creates a 'Map Object' which is used to store the count of comments for each unique post_id
  const commentNum = new Map();
  // This for loop iterates over each row (as specified by .rows) in the array returned from the SQL query.
  // The post_id value is extracted and saved as the const variable 'comment'
  // Then the map is updated. If a post_id already exists as a key in the map, it's value is increased by 1, if the post_id doesn't exist, it is added as a new key with a value of 1.
  for (const comment of commentRes.rows) {
    const postId = comment.posts_id;
    commentNum.set(postId, (commentNum.get(postId) || 0) + 1);
  }

  //  This converts the map into a regular objects to make rendering the content easier.
  const commentNumObject = Object.fromEntries(commentNum);

  // These next few lines follow the exact same logic as above for mapping the total number of likes on each post. //
  const likedRes = await sql`SELECT post_id FROM posts_likes`;
  const likedNum = new Map();
  for (const like of likedRes.rows) {
    const postId = like.post_id;
    likedNum.set(postId, (likedNum.get(postId) || 0) + 1);
  }
  const likedNumObject = Object.fromEntries(likedNum);

  return (
    <>
      <div id="feedArea">
        {posts.rows.map((post) => {
          if (post.repost_id === null) {
            return (
              <div id="postCard" key={post.post_id}>
                <Link href={`/posts/${post.post_id}`}>
                  <h2>{post.post_title}</h2>
                </Link>
                <p>
                  sentiment by{" "}
                  <Link
                    className="username"
                    href={`/userprofile/${post.profile_id}`}>
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
          } else if (post.repost_id != null) {
            return (
              <div id="postCard" key={post.post_id}>
                <p>THIS IS A REPOST</p>
                <Link href={`/posts/${post.post_id}`}>
                  <h2>{post.post_title}</h2>
                </Link>
                <p>
                  sentiment by{" "}
                  <Link
                    className="username"
                    href={`/userprofile/${post.profile_id}`}>
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
          }
        })}
      </div>
    </>
  );
}

{
  /* <div id="feedArea">
{posts.rows.map((post) => {
  return (
    <div id="postCard" key={post.post_id}>
      <Link href={`/posts/${post.post_id}`}>
        <h2>{post.post_title}</h2>
      </Link>
      <p>
        sentiment by{" "}
        <Link
          className="username"
          href={`/userprofile/${post.profile_id}`}>
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
</div> */
}
