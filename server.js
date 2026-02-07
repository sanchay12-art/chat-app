const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

io.on("connection", (socket) => {

  socket.on("sendMessage", (data) => {
    data.id = Date.now(); // unique message id
    io.emit("receiveMessage", data);
  });

  // SEEN EVENT
  socket.on("messageSeen", (msgId) => {
    io.emit("messageSeenUpdate", msgId);
  });

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
