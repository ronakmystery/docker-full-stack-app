import { useEffect, useState } from 'react'
import './App.css'
import { io } from "socket.io-client";

import Login from "./components/Login.jsx";

function App() {

  let nodeURL = "https://localhost:5001"

  const [user, setUser] = useState()


  return (
    <>
    {user?.username}
      <Login nodeURL={nodeURL} setUser={setUser}/>
    </>
  )
}

export default App
