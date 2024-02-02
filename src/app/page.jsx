// All posts that are created via the sentiment form are displayed here. //
import Link from "next/link";
import { sql } from "@vercel/postgres";
import NewPostForm from "@/app/components/NewPostForm";
import Feed from "@/app/components/Feed";

// Metadata for browser page title //
export const metadata = {
  title: "Sentiments | Echo",
  description: "Pending",
};

export default function HomePage() {
  return (
    <>
      <h2>This is the HomePage which shows the feed</h2>

      <NewPostForm />
      <Feed />
    </>
  );
}
