import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

export const sendAIMessage = async (message) => {
  const res = await API.post("/chats/chat", { message });
  return res.data;
};
