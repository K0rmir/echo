"use client";

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { useFormStatus } from "react-dom";
import "@/app/styles/addnewcommenttoast.css";

const ToastDemo = () => {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);
  const formStatus = useFormStatus();

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <Toast.Provider swipeDirection="right">
      <button
        className="Button large violet"
        onClick={() => {
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 1000);
        }}
        type="submit"
        disabled={formStatus.pending}
      >
        {formStatus.pending ? "Adding thought..." : "Add Thought"}
      </button>

      <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">Thought added!</Toast.Title>
        <Toast.Description asChild>
          Thanks for joining the conversation!
        </Toast.Description>
        {/* <Toast.Action className="ToastAction" asChild>
          <button className="Button small green">Undo</button>
        </Toast.Action> */}
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};

export default ToastDemo;
