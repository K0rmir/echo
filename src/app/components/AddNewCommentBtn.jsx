"use client";

import { useFormStatus } from "react-dom";

export default function AddNewCommentBtn() {
  const formStatus = useFormStatus();

  return (
    <>
      <button type="submit" disabled={formStatus.pending}>
        {formStatus.pending ? "Adding thought..." : "Add Thought"}
      </button>
    </>
  );
}
