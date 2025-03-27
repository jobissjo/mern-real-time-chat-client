import React from "react";
import PropTypes from "prop-types";
import {
  List, ListItem, ListItemText, Avatar, Typography, CircularProgress,
  Box, IconButton, Skeleton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NoUsersFound from "./NoUsersFound";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { acceptFriendRequest, sendFriendRequest } from "../../../../apiCalls/friendRequest";
import CheckIcon from '@mui/icons-material/Check';

const SearchUserList = ({ users, searchTerm, loading, setUsers }) => {
  const navigate = useNavigate();

  const handleAddFriendRequest = async (userId) => {
    try {
      const response = await sendFriendRequest(userId)
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isFriendRequest: true } : user
          )
        );

      }
    } catch (e) {

    }
  }

  const handleAcceptFriendRequest = async (requestId) => {
    debugger
    if (requestId) {
      const response = await acceptFriendRequest(requestId);
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.requestId === requestId ? { ...user, isFriend: true } : user
          )
        );
      }
    }

  }

  if (loading) {
    return (
      <List>
        {[...Array(5)].map((_, index) => (
          <ListItem key={index}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Skeleton variant="text" width="80%" height={20} />
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <List>
      {users.length > 0 ? (
        users.map((user) => (
          <ListItem key={user._id} button >
            {/* onClick={() => navigate(`/profile/${user._id}`)} */}
            <Avatar src={user.profilePic} alt={user.firstName} sx={{ mr: 2 }} />
            <ListItemText primary={`${user.firstName} ${user.lastName}`}
              slotProps={{
                primary: {
                  sx: {
                    color: "var(--text-color)",
                  },
                },
              }} />
            {user?.isFriend && <IconButton><ChatIcon color="primary" /> </IconButton>}
            {!user?.isFriend && !user?.isReceivedRequest && !user?.isFriendRequest && <IconButton
              onClick={() => handleAddFriendRequest(user._id)}> <PersonAddIcon color="secondary" /> </IconButton>
            }
            {!user?.isFriend && user?.isFriendRequest &&
              <IconButton >  <PendingActionsIcon sx={{ color: "orange" }} /> </IconButton>}
            {!user?.isFriend && user?.isReceivedRequest &&
              <IconButton onClick={() => handleAcceptFriendRequest(user.requestId)}>  <CheckIcon sx={{ color: "orange" }} /> </IconButton>}



          </ListItem>
        ))
      ) : (
        searchTerm && !loading && <NoUsersFound /> // Custom No Users Found Component
      )
      }
    </List>
  );
};

SearchUserList.propTypes = {
  users: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  setUsers: PropTypes.func.isRequired,
};

export default SearchUserList;
