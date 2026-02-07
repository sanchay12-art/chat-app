const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data); // sabko message bhejega
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ❗ VERY IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
