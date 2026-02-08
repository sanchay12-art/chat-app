<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Chat by Sanchay</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
:root{
  --bg:#eae6df;
  --header:#075e54;
  --my:#dcf8c6;
  --other:#ffffff;
  --accent:#25d366;
}
*{box-sizing:border-box}
body{
  margin:0;
  font-family:"Segoe UI", Arial;
  background:var(--bg);
  height:100vh;
  overflow:hidden;
}

/* SPLASH */
#splash{
  position:fixed;
  inset:0;
  background:linear-gradient(135deg,#075e54,#25d366);
  color:white;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  z-index:999;
  animation:fadeOut 1s ease 3s forwards;
}
@keyframes fadeOut{to{opacity:0;visibility:hidden}}

.header{
  background:var(--header);
  color:white;
  padding:14px;
  text-align:center;
  font-size:18px;
}

/* LOGIN */
.login{
  padding:8px;
  background:#f5f5f5;
}
.login input{
  width:100%;
  padding:10px;
  margin-bottom:6px;
  border-radius:8px;
  border:1px solid #ccc;
}

/* CHAT */
.chat{
  height:calc(100vh - 280px);
  overflow-y:auto;
  padding:10px;
}

/* MESSAGE */
.msg{
  max-width:75%;
  padding:8px 12px;
  margin:8px 0;
  border-radius:14px;
  font-size:14px;
}
.sender{
  font-size:11px;
  color:#555;
  margin-bottom:2px;
}
.right{
  background:var(--my);
  margin-left:auto;
  border-bottom-right-radius:0;
}
.left{
  background:var(--other);
  margin-right:auto;
  border-bottom-left-radius:0;
}
.tick{
  font-size:11px;
  text-align:right;
  color:#777;
}
.seen{
  color:#2196f3; /* BLUE */
}

/* INPUT */
.input-box{
  display:flex;
  padding:10px;
  background:#f0f0f0;
}
.input-box input{
  flex:1;
  padding:10px;
  border-radius:25px;
  border:1px solid #ccc;
}
.input-box button{
  margin-left:8px;
  width:45px;
  border:none;
  border-radius:50%;
  background:var(--accent);
  color:white;
  font-size:18px;
}
.footer{
  text-align:center;
  font-size:12px;
  color:#555;
}
</style>
</head>

<body>

<div id="splash">
  <h2>Chat App</h2>
  <p>Developed by <b>Sanchay Dutt</b></p>
</div>

<div class="header">Private Chat</div>

<div class="login">
  <input id="room" placeholder="Room ID (same for both)">
  <input id="username" placeholder="Your Name">
  <button onclick="login()">Join Chat</button>
</div>

<div id="chat" class="chat"></div>

<div class="input-box">
  <input id="message" placeholder="Type message">
  <button onclick="send()">➤</button>
</div>

<div class="footer">Developed by Sanchay Dutt</div>

<audio id="sendSound" src="send.mp3"></audio>
<audio id="receiveSound" src="receive.mp3"></audio>

<script src="/socket.io/socket.io.js"></script>
<script>
const socket = io();
const chat = document.getElementById("chat");
const sendSound = document.getElementById("sendSound");
const receiveSound = document.getElementById("receiveSound");

let ROOM = "", USER = "";

function login(){
  ROOM = room.value.trim();
  USER = username.value.trim();
  if(!ROOM || !USER) return alert("Enter room & name");

  socket.emit("joinRoom",{room:ROOM});
}

function addMsg(m){
  const mine = m.user === USER;
  const d=document.createElement("div");
  d.className="msg "+(mine?"right":"left");
  d.setAttribute("data-id",m.id);

  d.innerHTML=`
    <div class="sender">${m.user}</div>
    <div>${m.text}</div>
    ${mine?`<div class="tick ${m.seen?"seen":""}" id="t${m.id}">✔✔</div>`:""}
  `;
  chat.appendChild(d);
  chat.scrollTop=chat.scrollHeight;

  if(!mine){
    receiveSound.play();
    socket.emit("messageSeen",{room:ROOM,msgId:m.id});
  }
}

function send(){
  if(!ROOM || !USER) return alert("Join chat first");
  if(!message.value) return;

  socket.emit("sendMessage",{
    room:ROOM,
    user:USER,
    message:message.value
  });

  sendSound.play();
  message.value="";
}

socket.on("loadOldMessages",msgs=>{
  chat.innerHTML="";
  msgs.forEach(addMsg);
});

socket.on("receiveMessage",addMsg);

socket.on("messageSeenUpdate",id=>{
  const t=document.getElementById("t"+id);
  if(t) t.classList.add("seen");
});
</script>

</body>
</html>
