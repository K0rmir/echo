"use client";

import { useFormStatus } from "react-dom";

export default function AddNewJobBtn() {
  const formStatus = useFormStatus();

  return (
    <>
      <button type="submit" disabled={formStatus.pending}>
        {formStatus.pending ? "Posting sentiment..." : "Post Sentiment"}
      </button>
    </>
  );
}
