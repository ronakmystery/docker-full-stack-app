const { Server } = require("socket.io")
const globalState=require("./data")


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
                globalState.connectedUsers.set(user.email, socket); 
                console.log("Connected Users: ", globalState.connectedUsers)
            }

            socket.on("disconnect", () => {
                globalState.connectedUsers.delete(user?.email);
                io.emit("User count:", Object.keys(globalState.connectedUsers).length);
                console.log("Connected Users: ", globalState.connectedUsers)

            })
        });


    });
    return io;
}

module.exports = websocket
