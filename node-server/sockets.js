const { Server } = require("socket.io");
const globalState = require("./data");

const websocket = (server) => {
  const io = new Server(server, {
    path: "/api/socket.io",
    cors: {
      origin: "*", // Allow requests from React app
      methods: ["GET", "POST"],
    },
  });

  //Socket.io Connections
  io.on("connection", (socket) => {
    socket.emit("hello", { message: "connected to node server" });

    //socket sends to one client
    socket.on("user", (user) => {
      if (user?.email) {
        globalState.connectedUsers.add(user.email);
        console.log("Connected Users: ", globalState.connectedUsers);
      }

      socket.emit("messages", globalState.messages);
      socket.emit("tasks", globalState.tasks);

      socket.on("disconnect", () => {
        globalState.connectedUsers.delete(user?.email);
        console.log("Connected Users: ", globalState.connectedUsers);
      });
    });

    socket.on("sentMessage", (msg) => {
      globalState.messages.push(msg);
      //io send to all clients
      io.emit("messages", globalState.messages);
    });

    socket.on("claimTask", (data) => {
      console.log(data);

      globalState.tasks = globalState.tasks.map((task) => {
        if (task.id !== data.taskId) return task;

        // unclaim if the same user owns it
        if (task.userId === data.user.id) {
          return { ...task, userId: null };
        }

        // claim only if unclaimed
        if (task.userId === null) {
          return { ...task, userId: data.user.id };
        }

        // task alredy claimed
        return task;
      });

      io.emit("tasks", globalState.tasks);
    });
  });
  return io;
};

module.exports = websocket;
