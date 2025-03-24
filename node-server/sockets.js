const { Server } = require("socket.io")
const globalState = require("./data")


const websocket = (server) => {
    const io = new Server(server, {
        path: '/api/socket.io',
        cors: {
            origin: "*", // Allow requests from React app
            methods: ['GET', 'POST']
        }
    });

    //Socket.io Connections
    io.on("connection", (socket) => {
        socket.emit("hello", { message: "connected to node server" });


        socket.on('user', (user) => {
            if (user?.email) {
                globalState.connectedUsers.add(user.email);
                console.log("Connected Users: ", globalState.connectedUsers)
            }

            socket.emit("messages", globalState.messages)

            socket.on("disconnect", () => {
                globalState.connectedUsers.delete(user?.email);
                console.log("Connected Users: ", globalState.connectedUsers)

            })
        });


        socket.on("sentMessage", (msg) =>  {
            globalState.messages.push(msg);
            io.emit("messages", globalState.messages);
        });


    });
    return io;
}

module.exports = websocket
