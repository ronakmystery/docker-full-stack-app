import "./App.css";
import { Routes, Route } from "react-router-dom";

import Video from "./routes/Video.jsx";
import Login from "./components/Login.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/video" element={<Video />} />
      </Routes>
    </>
  );
}

export default App;
