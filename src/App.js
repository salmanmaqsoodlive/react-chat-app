import "./App.css";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import ChatArea from "./Components/ChatArea";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/chat"
            element={
              <div className="chat-container">
                <Sidebar />
                <ChatArea />
              </div>
            }
          ></Route>
          <Route
            path="/chat/:id"
            element={
              <div className="chat-container">
                <Sidebar />
                <ChatArea />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
