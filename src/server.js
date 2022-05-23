const http = require("http");
const io = require("socket.io")(http);

io.on("connection", function(socket) {
  socket.on("new-operations", function(data) {
    io.emit("new-remote-operations", data);
  });
  
  socket.on("send", message => {
    io.emit("message", {
      text: message
    });
  });
});
var port = 8080;
console.log("listening on: "+port);