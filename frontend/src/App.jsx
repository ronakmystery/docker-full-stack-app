import { useEffect, useState, useRef } from 'react'
import './App.css'
import { io } from "socket.io-client";

import Login from "./components/Login.jsx";

function App() {


  let nodeURL = "https://localhost:5001"





  return (
    <>      
       <Login nodeURL={nodeURL} />
    </>
  )
}

export default App
