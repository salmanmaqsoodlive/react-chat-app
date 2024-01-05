import React, { useEffect, useState } from "react";
import withAuthentication from "../utils/withAuthentication";
import axios from "axios";
import { LinearProgress, List } from "@mui/material";
import Box from "@mui/material/Box";
import UserItem from "./UserItem";

const Sidebar = () => {
  const BASE_URL = "http://ec2-54-237-221-234.compute-1.amazonaws.com:8000";
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthTokenFromCookie = () => {
    const cookies = document.cookie.split(";");

    for (const key in cookies) {
      if (Object.hasOwnProperty.call(cookies, key)) {
        const cookie = cookies[key];

        const [name, value] = cookie.trim().split("=");

        if (name == "token") {
          return value;
        }
      }
    }
  };

  const fetchUsers = async () => {
    const token = getAuthTokenFromCookie();
    if (!token) return;
    const data = await axios.get(BASE_URL + "/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUserList(data.data);
    setIsLoading(false);
  };

  return (
    <div className="sidebar">
      {isLoading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {userList.map((user, index) => (
            <UserItem
              key={index}
              email={user.email}
              name={user.first_name + " " + user.last_name}
              id={user.id}
            />
          ))}
        </List>
      )}
    </div>
  );
};

export default withAuthentication(Sidebar);
