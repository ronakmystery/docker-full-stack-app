const { Server } = require("socket.io")


let connectedUsers = {};

const websocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Allow requests from React app
        }
    });

    //Socket.io Connections
    io.on("connection", (socket) => {
        socket.emit("hello", { message: "connected to node server" });


        socket.on('user', (user) => {
            if (user?.email) {
                connectedUsers[user.email] = user;
                console.log("Connected Users: ", connectedUsers)
            }

            socket.on("disconnect", () => {
                delete connectedUsers[user?.email]
                io.emit("User count:", Object.keys(connectedUsers).length);
                console.log("Connected Users: ", connectedUsers)

            })
        });


    });
    return io;
}

module.exports = websocket
