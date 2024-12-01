const http = require("http");
const WebSocketServer = require("websocket").server
let connections = [];

// Create a raw http server (this will help us create the TCP which will then
// pass to the websocket to do the job)
const httpserver = http.createServer()

// Pass the httpserver object to the WebSocketServer library to do all the job,
// this class will override the req/res
const websocket = new WebSocketServer({"httpServer": httpserver })

// Listen to the TCP socket
httpserver.listen(8080, () => console.log("My server is listening on port 8080"))

// When a legit websocket request comes listen to it and get the connection...
// once you get a connection thats it!
websocket.on("request", request=> {

    const connection = request.accept(null, request.origin)
    connection.on("message", message => {
        //someone just sent a message tell everybody
        connections.forEach (c=> c.send(`User${connection.socket.remotePort} says: ${message.utf8Data}`))
    }) 
    
    connections.push(connection)
    //someone just connected, tell everybody
    connections.forEach (c=> c.send(`User${connection.socket.remotePort} just connected.`))
  
})

// Client code
//let ws = new WebSocket("ws://localhost:8080");
//ws.onmessage = message => console.log('Received: ${message.data}');
//ws.send("Hello! I'm client")
