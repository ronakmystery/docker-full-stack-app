import { useState, useRef, useEffect } from "react";

import { Notifications } from "./Notifications.jsx";

function Messaging({ user, socket }) {
  const { requestNotificationPermission, sendNotification } =
    Notifications(user);

  const [messages, setMessages] = useState([]);

  socket.current?.on("messages", (data) => {
    console.log("Received from server:", data);
    setMessages([...data]);
  });

  return (
    <div id="messages">
      Messages
      {messages.map((m) => (
        <div>
          {m?.from} : {m?.message}
        </div>
      ))}
      <button onClick={requestNotificationPermission}>get notifications</button>
      <button
        onClick={() => {
          let message = prompt("message:");
          if (message) {
            socket.current?.emit("sentMessage", {
              from: user?.username,
              message,
            });

            sendNotification(message);
          }
        }}
      >
        send message
      </button>
    </div>
  );
}

export default Messaging;
