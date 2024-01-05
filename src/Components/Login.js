import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const BASE_URL = "http://ec2-54-237-221-234.compute-1.amazonaws.com:8000";
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();

  const login = async () => {
    let payload = {
      email: email,
      password: password,
    };
    const data = await axios.post(BASE_URL + "/login", payload);
    console.log("data", data.data.user);
    localStorage.setItem("currentUser", JSON.stringify(data.data.user));
    const token = data.data.token;
    document.cookie = `token=${token}; path=/`;
    navigate("/chat");
  };

  return (
    <div>
      <div className="mt-3">
        <TextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mt-3">
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <Button variant="contained" onClick={login}>
          Login
        </Button>
      </div>
    </div>
  );
}

export default Login;
