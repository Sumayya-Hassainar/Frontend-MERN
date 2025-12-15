import { useState } from "react";
import { sendAIMessage } from "../../api/helpapi";

export default function HelpDesk() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const send = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((m) => [...m, userMsg]);

    setInput("");

    const res = await sendAIMessage(userMsg.text);

    setMessages((m) => [
      ...m,
      { sender: "ai", text: res.reply },
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Help Desk</h1>

      <div className="border rounded p-4 h-96 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              m.sender === "user"
                ? "bg-blue-500 text-white text-right"
                : "bg-gray-200"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
        />
        <button
          onClick={send}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
