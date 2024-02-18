// Functionality and rendering for individual posts when clicking through to them to see all comments.

import {sql} from "@vercel/postgres";
import {Revalidate} from "next/dist/server/lib/revalidate";
import {redirect} from "next/navigation";
import {auth} from "@clerk/nextjs";
import Link from "next/link";
import NewCommentForm from "@/app/components/newCommentForm";
import LikeButton from "@/app/components/LikeButton";
import RepostButton from "@/app/components/RepostButton";
import "@/app/styles/feedarea.css";

export default async function individualPost({params}) {
  "use server";
  const {userId} = auth();
  //  db query to GET all profile info from profiles table.
  const profileRes = await sql`SELECT * FROM profiles
  WHERE clerk_user_id = ${userId}`;
  const profile_username = profileRes.rows[0].username;
  const profile_id = profileRes.rows[0].profile_id;
  // db query to GET all posts from the posts table.
  const post =
    await sql`SELECT posts.post_title, posts.post_content, profiles.username, profiles.id AS profile_id  FROM posts
  JOIN profiles ON posts.user_id = profiles.id
  WHERE posts.id = ${params.id}`;

  //   db query to GET all comments from comments table.
  const comments =
    await sql`SELECT comments.id, profiles.id AS profile_id, profiles.username, comments.comment_content from comments
  JOIN profiles ON profiles_id = profiles.id
  WHERE posts_id = ${params.id}`;

  //   db query to GET all comments from comments table.
  const commentRes = await sql`SELECT posts_id FROM comments
  WHERE posts_id = ${params.id}`;

  // query to get likes from post likes table //
  const likesNum =
    await sql`SELECT * FROM posts_likes WHERE post_id = ${params.id}`;

  return (
    <div id="individualPostContainer">
      <div id="individualPostContent">
        <h3 className="title">{post.rows[0].post_title}</h3>
        <p className="content">{post.rows[0].post_content}</p>
        <p>
          sentiment by{" "}
          <Link href={`/userprofile/${post.rows[0].profile_id}`}>
            {post.rows[0].username}
          </Link>
        </p>
        <div className="individualPostInfo">
          <LikeButton post_id={params.id} />
          <p className="likes">{likesNum.rows.length} likes</p>
          <p className="comments">{commentRes.rows.length || 0} thoughts</p>
          <RepostButton post_id={params.id} />
        </div>
      </div>
      <div id="commentsArea">
        <NewCommentForm params={params} />
        {comments.rows.map((comment) => {
          return (
            <div id="commentCard" key={comment.id}>
              <h3>
                <Link href={`/userprofile/${comment.profile_id}`}>
                  {comment.username}
                </Link>
              </h3>
              <p>{comment.comment_content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
