const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("hello");
});
var toUser = false;
const messages = [];
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("USER_ONLINE", (msg) => {
    console.log(msg);
  });
  socket.on("typing", (msg) => {
    io.emit("typing", msg);
  });
  socket.on("relode", (msg) => {
    io.emit("message_reload", messages);
  });
  socket.on("send_message", (msg) => {
    const date = new Date();
    console.log(date);
    messages.push({
      message: msg["message"],
      createdAt: date,
      toUser: (toUser = !toUser),
      user: msg["user"],
      _id: msg["_id"],
    });
    io.emit("message", messages);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
