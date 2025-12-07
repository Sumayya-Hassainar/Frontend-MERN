// src/api/helpapi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const fetchChats = async () => {
  const res = await axios.get(`${API_BASE}/chats`, { withCredentials: true });
  return res.data;
};

export const createChat = async (vendorId) => {
  const res = await axios.post(`${API_BASE}/chats`, { vendorId }, { withCredentials: true });
  return res.data;
};

export const sendMessage = async (chatId, content) => {
  const res = await axios.post(
    `${API_BASE}/chats/${chatId}/message`,
    { content },
    { withCredentials: true }
  );
  return res.data;
};
