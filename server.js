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

function getTime(){
  const d = new Date();
  const h = String(d.getHours()).padStart(2,"0");
  const m = String(d.getMinutes()).padStart(2,"0");
  return `${h}:${m}`;
}

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ room, user }) => {
    socket.room = room;
    socket.user = user;
    socket.join(room);

    if(!chats[room]) chats[room] = [];

    // load old messages
    socket.emit("loadOldMessages", chats[room]);

    // notify OTHERS that this user is online
    socket.to(room).emit("friendStatus", {
      user,
      status: "online"
    });
  });

  socket.on("sendMessage", ({ room, user, message }) => {
    const msg = {
      id: Date.now(),
      user,
      text: message,
      time: getTime(),
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
    if(socket.room && socket.user){
      socket.to(socket.room).emit("friendStatus", {
        user: socket.user,
        status: "offline"
      });
    }
  });

});

server.listen(3000, () =>
  console.log("Server running on port 3000")
);
