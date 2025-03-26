import React from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemText, Avatar, Typography, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SearchUserList = ({ users, searchTerm, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <List>
      {users.length > 0 ? (
        users.map((user) => (
          <ListItem key={user._id} button onClick={() => navigate(`/profile/${user._id}`)}>
            <Avatar src={user.profilePic} alt={user.firstName} sx={{ mr: 2 }} />
            <ListItemText primary={`${user.firstName} ${user.lastName}`} />
          </ListItem>
        ))
      ) : (
        searchTerm && (
          <Typography color="textSecondary" align="center">
            No users found
          </Typography>
        )
      )}
    </List>
  );
};
SearchUserList.propTypes = {
  users: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SearchUserList;