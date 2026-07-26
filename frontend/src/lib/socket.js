import { io } from "socket.io-client";

let socket;

export function getSocket(userId) {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5001");
  }

  if (userId) socket.emit("user:join", userId);
  return socket;
}
