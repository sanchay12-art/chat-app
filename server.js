const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

io.on("connection", (socket) => {

  // JOIN PRIVATE ROOM
  socket.on("joinRoom", ({ user, friend }) => {
    const room =
      user < friend ? `${user}_${friend}` : `${friend}_${user}`;
    socket.join(room);
  });

  // SEND MESSAGE TO ROOM ONLY
  socket.on("sendMessage", (data) => {
    data.id = Date.now();

    const room =
      data.user < data.friend
        ? `${data.user}_${data.friend}`
        : `${data.friend}_${data.user}`;

    io.to(room).emit("receiveMessage", data);
  });

  // SEEN EVENT (ROOM ONLY)
  socket.on("messageSeen", ({ msgId, user, friend }) => {
    const room =
      user < friend ? `${user}_${friend}` : `${friend}_${user}`;
    io.to(room).emit("messageSeenUpdate", msgId);
  });

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
