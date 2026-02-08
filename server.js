const express = require("express");
const http = require("http");
const fs = require("fs");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

const DB_FILE = "chat-db.json";

// load old chats
let chats = fs.existsSync(DB_FILE)
  ? JSON.parse(fs.readFileSync(DB_FILE))
  : {};

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(chats, null, 2));
}

io.on("connection", (socket) => {

  // JOIN ROOM (ID + PASSWORD = ROOM)
  socket.on("joinRoom", ({ userId, password }) => {
    const room = userId + "_" + password;
    socket.join(room);

    if (!chats[room]) chats[room] = [];
    socket.emit("loadOldMessages", chats[room]);
  });

  // SEND MESSAGE
  socket.on("sendMessage", (data) => {
    const room = data.userId + "_" + data.password;

    const msg = {
      id: Date.now(),
      user: data.userId,
      text: data.message
    };

    chats[room].push(msg);
    saveDB();

    io.to(room).emit("receiveMessage", msg);
  });

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
