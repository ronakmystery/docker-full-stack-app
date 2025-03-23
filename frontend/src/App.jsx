import './App.css'

import Login from "./components/Login.jsx";


function App() {


  const currentHost = window.location.hostname; 
  const nodeURL = `${window.location.origin}`;





  return (
    <>      

       <Login nodeURL={nodeURL} />
    </>
  )
}

export default App
