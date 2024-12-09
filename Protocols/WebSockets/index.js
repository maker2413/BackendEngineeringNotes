const http = require("http");
const WebSocketServer = require("websocket").server
let connections = [];

// create a raw http server (this will help us create the TCP which we will
// pass to the websocket to do the job)
const httpserver = http.createServer()

// Pass the httpserver object to the WebSocketServer library to do the job.
// This class will override the req/res
const websocket = new WebSocketServer({"httpServer": httpserver})

// Listen on the TCP socket
httpserver.listen(8080, () => console.log("My server is listening on port 8080"))

// When a legit websocket request comes, listen to it and get the connection.
// Once you get a connection, that it!
websocket.on("request", request=> {

  const connection = request.accept(null, request.origin)
  connection.on("message", message => {
    // Someone just sent a message tell everybody
    connections.forEach (c=> c.send('User${connection.socket.remotePort} says: ${message.utf8Data}'))
  })

  connections.push(connection)
  // Someone just connected, tell everybody
  connections.forEach (c=> c.send('User${connection.socket.remotePort} just connected.'))
})

// Client code
//let ws = new WebSocket("ws://localhost:8080");
//ws.onmessage = message => console.log('${message.data}');
//ws.send("Hello! I'm client")
