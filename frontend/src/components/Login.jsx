import { useState } from "react";

function Login({ nodeURL,setUser }) {
    const [formData, setFormData] = useState({
        email: "x@x.com",
        password: "x",
        username:"roro"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response = await fetch(`${nodeURL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            let loginData = await response.json();
            console.log(loginData)

            try {

                let response = await fetch(`${nodeURL}/api/user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                });

                let userData = await response.json();

                console.log(userData)

                setUser(userData)


            } catch (error) {
                console.log("get user error", error)

            }


        } catch (error) {
            console.log("Login Error:", error);
        }
    };

    return (
        <div>
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
        </div>
    );
}

export default Login;
