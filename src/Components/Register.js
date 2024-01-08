import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/globalVariables";

function Register() {
  const [email, setEmail] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [password, setPassword] = useState(null);

  const signup = () => {
    let payload = {
      email: email,
      first_name: firstname,
      last_name: lastname,
      password: password,
    };
    axios.post(BASE_URL + "/register", payload);
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
          id="first_name"
          label="First Name"
          type="text"
          variant="outlined"
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <TextField
          id="last_name"
          label="Last Name"
          type="text"
          variant="outlined"
          onChange={(e) => setLastname(e.target.value)}
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
        <Button variant="contained" onClick={signup}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default Register;
