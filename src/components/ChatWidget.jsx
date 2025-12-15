// src/components/ChatWidget.jsx
import { useState } from "react";
import HelpDesk from "../pages/common/HelpDesk";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 z-50 shadow-lg">
          <HelpDesk />
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-violet-700 transition text-4xl"
      >
        🤖
      </button>
    </>
  );
}
