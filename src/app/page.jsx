// All posts that are created via the sentiment form are displayed here. //
import Link from "next/link";
import {sql} from "@vercel/postgres";
import NewPostForm from "@/app/components/NewPostForm";
import Feed from "@/app/components/Feed";

// Metadata for browser page title //
export const metadata = {
  title: "Sentiment Feed | Echo",
  description: "Share sentiments & Echo others.",
};

export default function HomePage() {
  return (
    <>
      <h2>
        Welcome to your echo chamber, where you can share sentiments and echo
        others.
      </h2>

      <NewPostForm />
      <Feed />
    </>
  );
}
