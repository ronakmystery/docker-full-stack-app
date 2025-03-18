import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io } from "socket.io-client";


function App() {
  

    let getUsers = () => {

    fetch("https://localhost:5001/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("Data from node that got data from MariaDB:", data);

      })
      .catch((err) => console.error("Fetch Error:", err));
  }

  return (
    <>
            <button onClick={getUsers}>get users</button>

    </>
  )
}

export default App
