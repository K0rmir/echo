import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header>
      <div id="userBtn">
        <UserButton afterSignOutUrl="/" />
      </div>
      <h1>Title</h1>
      {}
    </header>
  );
}
