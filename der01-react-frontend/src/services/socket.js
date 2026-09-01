import { io } from "socket.io-client";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket = null;

export function connectSocket() {
  if (USE_MOCK) return null;
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket", "polling"],
      auth: { token: localStorage.getItem("der01_token") },
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
