import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";


let getUser = async (nodeURL, userid) => {
    try {

        let response = await fetch(`${nodeURL}/api/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "userId": userid }),
        });

        let userData = await response.json();
        return userData

    } catch (error) {
        console.log("get user error", error)

    }
}

let login = async (nodeURL, formData) => {

    try {
        let response = await fetch(`${nodeURL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        let loginData = await response.json();
        return loginData
    } catch (error) {
        console.log("Login Error:", error);
    }
}


function Login({ nodeURL }) {

    const [user, setUser] = useState()

    const [formData, setFormData] = useState({
        email: "x@x.com",
        password: "x",
        username: "roro"
    });



    //Auto-login from localStorage
    useEffect(() => {
        console.log("auto-login")
        let userid = localStorage.getItem("userid");

        if (userid) {
            try {
                const parsedId = JSON.parse(userid);
                getUser(nodeURL, parsedId).then(data => {
                    console.log(data)
                    setUser(data)
                    initSocket(data)

                })
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

        login(nodeURL, formData).then(data => {
            console.log(data)
            localStorage.setItem("userid", JSON.stringify(data.userId));
            getUser(nodeURL, data.userId).then(data => {
                console.log(data)
                setUser(data)
                initSocket(data)

            })
        })

    };

    const socketRef = useRef(null);
    let initSocket = (user) => {
        socketRef.current = io(nodeURL);

        socketRef.current.on('hello', (data) => {
            console.log('Received:', data);
        });
        console.log("socket user")
        socketRef.current.emit("user", user);

    }

    return (
        <div>
            {user?.username}


            {
                user ?
                    <>
                        <button onClick={() => {
                            localStorage.removeItem("userid");
                            setUser(null)
                            socketRef.current.disconnect()
                        }}> Log out</button>
                    </>
                    : <>
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
            }


        </div>
    );
}

export default Login;
