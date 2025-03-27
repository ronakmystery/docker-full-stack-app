import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

import Messaging from "./Messaging.jsx";

let getUser = async (userid) => {
  try {
    let response = await fetch(`/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userid }),
    });

    let userData = await response.json();
    return userData;
  } catch (error) {
    console.log("get user error", error);
  }
};

let login = async (formData) => {
  try {
    let response = await fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    let loginData = await response.json();
    return loginData;
  } catch (error) {
    console.log("Login Error:", error);
  }
};

function Login() {
  const [user, setUser] = useState();

  const [formData, setFormData] = useState({
    email: "x@x",
    password: "x",
    username: "x",
  });

  //Auto-login from localStorage
  useEffect(() => {
    console.log("auto-login");
    let userid = localStorage.getItem("userid");

    if (userid) {
      try {
        const parsedId = JSON.parse(userid);
        getUser(parsedId).then((data) => {
          console.log(data);
          setUser(data);
          initSocket(data);
        });
      } catch (error) {
        console.error("Error parsing stored user ID:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    login(formData).then((data) => {
      console.log(data);
      if (data?.userId) {
        localStorage.setItem("userid", JSON.stringify(data.userId));
        getUser(data.userId).then((data) => {
          console.log(data);
          setUser(data);
          initSocket(data);
        });
      }
    });
  };

  const socket = useRef(null);
  let initSocket = (user) => {
    socket.current = io("/", {
      path: "/api/socket.io",
      transports: ["websocket"],
      secure: true,
    });

    socket.current.on("connect", () => {
      console.log("Connected to socket");
      socket.current.emit("user", user);
    });

    socket.current.on("hello", (data) => {
      console.log("Received from server:", data);
    });


  };


  return (
    <div>

        


      {user ? (
        <>
          {user?.username}

          <Messaging socket={socket} user={user}/>


          <button
            onClick={() => {
              localStorage.removeItem("userid");
              setUser(null);
              socket.current.disconnect();
            }}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <h2>Login or Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login / Register</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Login;
