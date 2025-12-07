// src/pages/HelpDesk.jsx
import React, { useEffect, useState } from "react";
import { fetchChats, createChat, sendMessage } from "../../api/helpapi";
import { fetchCustomerOrders} from "../../api/api"; // backend API for customer orders

export default function HelpDesk() {
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [issueSearch, setIssueSearch] = useState("");

  // Load orders and chats
  const loadData = async () => {
    try {
      setLoading(true);
      const ordersData = await fetchCustomerOrders(); // must return orders with commonIssues array
      setOrders(ordersData);

      const chatsData = await fetchChats();
      setChats(chatsData);

      if (chatsData.length > 0) setActiveChat(chatsData[0]);
    } catch (err) {
      console.error(err);
      alert("Failed to load Help Desk data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNewChat = async (orderId) => {
    try {
      const chat = await createChat(orderId); // associate chat with the order
      setChats((prev) => [chat, ...prev]);
      setActiveChat(chat);
    } catch (err) {
      console.error(err);
      alert("Failed to start chat");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;
    try {
      const updatedChat = await sendMessage(activeChat._id, message.trim());
      setActiveChat(updatedChat);
      setChats((prev) =>
        prev.map((c) => (c._id === updatedChat._id ? updatedChat : c))
      );
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  if (loading)
    return <p className="text-center mt-6">Loading Help Desk...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 flex gap-4 h-[700px]">
      {/* Orders & common issues */}
      <div className="w-1/4 border rounded p-2 flex flex-col overflow-y-auto">
        <h2 className="font-bold mb-2 text-lg">Your Orders</h2>

        {orders.map((order) => (
          <div key={order._id} className="mb-3 p-2 border rounded">
            <p className="font-semibold">{order.productName}</p>
            <p className="text-xs text-gray-500">Order ID: {order._id}</p>

            <input
              type="text"
              placeholder="Search common issues..."
              className="w-full text-xs mt-1 p-1 border rounded"
              value={issueSearch}
              onChange={(e) => setIssueSearch(e.target.value)}
            />

            <ul className="text-xs text-gray-600 list-disc ml-4 mt-1 max-h-24 overflow-y-auto">
              {order.commonIssues
                ?.filter((issue) =>
                  issue.toLowerCase().includes(issueSearch.toLowerCase())
                )
                .map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
            </ul>

            <button
              onClick={() => handleNewChat(order._id)}
              className="mt-2 w-full bg-indigo-600 text-white py-1 text-sm rounded"
            >
              Chat about this product
            </button>
          </div>
        ))}
      </div>

      {/* Chat list */}
      <div className="w-1/3 border rounded p-2 flex flex-col">
        <h2 className="font-bold mb-2 text-lg">Chats</h2>
        <div className="overflow-y-auto flex-1">
          {chats.map((c) => (
            <div
              key={c._id}
              onClick={() => setActiveChat(c)}
              className={`cursor-pointer p-2 mb-1 rounded ${
                activeChat?._id === c._id
                  ? "bg-indigo-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="font-semibold">{c.order?.productName}</p>
              <p className="text-xs text-gray-500">
                {c.messages?.slice(-1)[0]?.content || "No messages yet"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="w-2/3 border rounded flex flex-col">
        <div className="border-b p-2 font-semibold">
          {activeChat ? activeChat.order?.productName : "Select a chat"}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {activeChat?.messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-2 rounded max-w-xs ${
                m.sender === "customer"
                  ? "bg-indigo-100 self-end"
                  : "bg-gray-200 self-start"
              }`}
            >
              {m.content}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(m.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        {activeChat && (
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded px-2 py-1"
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 text-white px-4 py-1 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
