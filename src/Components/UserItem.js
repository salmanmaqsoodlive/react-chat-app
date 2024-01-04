import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const UserItem = (props) => {
  return (
    <Link to={`/chat/${props.id}`}>
      <ListItem>
        <ListItemAvatar>
          <Avatar></Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={props.name}
          secondary={props.email}
        ></ListItemText>
      </ListItem>
    </Link>
  );
};

export default UserItem;
