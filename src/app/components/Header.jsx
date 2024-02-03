import {UserButton, auth} from "@clerk/nextjs";
import Link from "next/link";
import "@/app/styles/header.css";

export default function Header() {
  const {userId} = auth();
  return (
    <header id="globalHeader">
      <div className="userBtnContainer">
        <div className="userBtn">
          {userId && <UserButton afterSignOutUrl="/" />}
        </div>
      </div>

      <h1>Echo</h1>
      <p>A place for sentiments</p>
    </header>
  );
}
