import './App.css'

import Login from "./components/Login.jsx";


function App() {


  const currentHost = window.location.hostname; 
  const nodeURL = `https://${currentHost}:5001`;





  return (
    <>      

       <Login nodeURL={nodeURL} />
    </>
  )
}

export default App
