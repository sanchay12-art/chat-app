const express = require("express");
const http = require("http");
const fs = require("fs");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "chats.json";

// load db
let db = fs.existsSync(DB_FILE)
  ? JSON.parse(fs.readFileSync(DB_FILE))
  : {};

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// get chats list
app.post("/getChats", (req, res) => {
  const { userId, password } = req.body;
  const key = userId + "_" + password;
  res.json(db[key] || {});
});

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ userId, password, friend }) => {
    const acc = userId + "_" + password;
    const room = acc + "_" + friend;

    socket.join(room);

    if (!db[acc]) db[acc] = {};
    if (!db[acc][friend]) db[acc][friend] = [];

    saveDB();
  });

  socket.on("sendMessage", (data) => {
    const acc = data.userId + "_" + data.password;
    const room = acc + "_" + data.friend;

    const msg = {
      id: Date.now(),
      user: data.userId,
      text: data.message
    };

    db[acc][data.friend].push(msg);
    saveDB();

    io.to(room).emit("receiveMessage", msg);
  });

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
