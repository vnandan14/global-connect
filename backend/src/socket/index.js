export function attachSocketHandlers(io) {
  io.on("connection", (socket) => {
    socket.on("user:join", (userId) => {
      if (userId) socket.join(String(userId));
    });

    socket.on("typing", ({ receiverId, senderId }) => {
      socket.to(String(receiverId)).emit("typing", { senderId });
    });
  });
}
