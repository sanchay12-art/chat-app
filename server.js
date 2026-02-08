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
let onlineUsers = {}; // room -> Set(users)

function saveDB(){
  fs.writeFileSync(DB, JSON.stringify(chats, null, 2));
}

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ room, user }) => {
    socket.room = room;
    socket.user = user;

    socket.join(room);

    if(!chats[room]) chats[room] = [];
    if(!onlineUsers[room]) onlineUsers[room] = new Set();

    onlineUsers[room].add(user);

    socket.emit("loadOldMessages", chats[room]);
    io.to(room).emit("userStatus", {
      user,
      status: "online"
    });
  });

  socket.on("sendMessage", ({ room, user, message }) => {
    const msg = {
      id: Date.now(),
      user,
      text: message,
      time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
      seen: false
    };

    chats[room].push(msg);
    saveDB();

    io.to(room).emit("receiveMessage", msg);
  });

  socket.on("typing", ({ room, user }) => {
    socket.to(room).emit("typing", user);
  });

  socket.on("messageSeen", ({ room, msgId }) => {
    const m = chats[room]?.find(x => x.id === msgId);
    if(m){
      m.seen = true;
      saveDB();
      io.to(room).emit("messageSeenUpdate", msgId);
    }
  });

  socket.on("disconnect", () => {
    const { room, user } = socket;
    if(room && user && onlineUsers[room]){
      onlineUsers[room].delete(user);
      io.to(room).emit("userStatus", {
        user,
        status: "offline"
      });
    }
  });

});

server.listen(3000, () =>
  console.log("Server running on port 3000")
);
