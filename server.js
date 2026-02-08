const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

io.on("connection", (socket) => {

  // JOIN ROOM USING USERID + PASSWORD
  socket.on("joinRoom", ({ userId, password }) => {
    const room = userId + "_" + password;
    socket.join(room);
  });

  // SEND MESSAGE (ROOM ONLY)
  socket.on("sendMessage", (data) => {
    data.id = Date.now();
    const room = data.userId + "_" + data.password;
    io.to(room).emit("receiveMessage", data);
  });

  // SEEN EVENT
  socket.on("messageSeen", (data) => {
    const room = data.userId + "_" + data.password;
    io.to(room).emit("messageSeenUpdate", data.msgId);
  });

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
