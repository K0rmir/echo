import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import "@/app/styles/header.css";

export default function Header() {
  const { userId } = auth();
  return (
    <header id="globalHeader">
      <div id="userBtn">{userId && <UserButton afterSignOutUrl="/" />}</div>
      <h1>Title</h1>
      <p>This is the header</p>
    </header>
  );
}
