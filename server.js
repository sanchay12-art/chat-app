const express = require("express");
const http = require("http");
const fs = require("fs");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

const DB = "chat-db.json";
let chats = fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB)) : {};

function saveDB(){
  fs.writeFileSync(DB, JSON.stringify(chats, null, 2));
}

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
    if(!chats[room]) chats[room] = [];
    socket.emit("loadOldMessages", chats[room]);
  });

  socket.on("sendMessage", (data) => {
    const msg = {
      id: Date.now(),
      user: data.user,
      text: data.message,
      seen: false
    };

    chats[data.room].push(msg);
    saveDB();

    io.to(data.room).emit("receiveMessage", msg);
  });

  // 👁️ BLUE SEEN
  socket.on("messageSeen", ({ room, msgId }) => {
    const msgs = chats[room] || [];
    const m = msgs.find(x => x.id === msgId);
    if(m){
      m.seen = true;
      saveDB();
      io.to(room).emit("messageSeenUpdate", msgId);
    }
  });

});

server.listen(3000, () =>
  console.log("Server running on port 3000")
);
