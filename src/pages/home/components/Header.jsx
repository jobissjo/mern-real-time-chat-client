import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { clearAllNotificationOfUser, getAllNotification, readNotification } from '../../../apiCalls/notification';
import toast from 'react-hot-toast';
import {
  Notifications as NotificationsIcon, PowerSettingsNew as LogoutIcon,
  Brightness4 as DarkModeIcon, Chat as ChatIcon,
} from "@mui/icons-material";
import { getUserPreferences, updateUserPreferences } from '../../../apiCalls/preference';
import {
  AppBar, Toolbar, Typography, IconButton,
  Badge, Menu, MenuItem, Switch,
  Avatar, Box, Divider, ListItemIcon, ListItemText,
} from "@mui/material";
import MarkAsReadIcon from "@mui/icons-material/DoneAll";
import { setPreference } from "../../../redux/userSlice.js";
import SearchIcon from "@mui/icons-material/Search";

const Header = ({ socket }) => {
  const { user, preference } = useSelector(state => state.userReducer);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  function getFullName() {
    return user.firstName + " " + user.lastName;
  }


  function getInitials() {
    return user.firstName?.toUpperCase().charAt(0) + user.lastName?.toUpperCase().charAt(0);
  }
  const logOut = async () => {
    localStorage.removeItem('token')
    navigate('/login');
    socket.emit('user-logout', user._id)

  }
  // GET NOTIFICATION
  const getNotification = async () => {
    try {
      let response = await getAllNotification()
      if (response.status === 200) {
        setNotifications(response.data?.data)
      }
    }
    catch (error) {
      console.log(error)
    }
  }




  const updatePreference = async () => {
    try {
      let response = await updateUserPreferences({ isDarkMode: !preference?.isDarkMode })
      if (response.status === 200) {
        const preferenceResponse = await getUserPreferences()
        dispatch(setPreference(preferenceResponse.data?.data));

      }
    }
    catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getNotification();
  }, [showNotification, unreadNotificationCount])

  useEffect(() => {
    console.log(preference, 'preference');

    if (preference?.isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('root');
    } else {
      document.body.classList.add('root');
      document.body.classList.remove('dark-mode');
    }
  }, [preference?.isDarkMode])

  const markReadNotification = async (notificationId) => {
    try {
      let response = await readNotification(notificationId);
      if (response.status === 200) {
        setUnreadNotificationCount(unreadNotificationCount - 1)
      }
      else {
        toast.error(response.error.message)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  // FETCH USER PREFERENCE  

  const clearAllNotifications = async () => {
    try {
      let response = await clearAllNotificationOfUser()
      if (response.status === 200) {
        // toast.success(response.data?.message ?? 'All notifications cleared')
        setUnreadNotificationCount(0);
        getNotification();
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "var(--secondary-color);" }}>
      <Toolbar>
        <IconButton color="inherit" onClick={() => navigate("/")}>
          <ChatIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Quick Chat
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <DarkModeIcon sx={{ mr: 1 }} />
          <Switch checked={preference?.isDarkMode} onChange={updatePreference} color="default" />
        </Box>

        {/* Search Icon Button */}
        <IconButton color="inherit" onClick={() => navigate("/search")}>
          <SearchIcon />
        </IconButton>

        <IconButton color="inherit" onClick={(event) => setAnchorEl(event.currentTarget)}>
          <Badge badgeContent={unreadNotificationCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem disabled>
            <Typography variant="h6">Notifications</Typography>
          </MenuItem>
          <Divider />
          {notifications.length === 0 ? (
            <MenuItem>
              <Typography variant="body2" color="textSecondary">
                No new notifications
              </Typography>
            </MenuItem>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification._id}
                onClick={() => markReadNotification(notification._id)}
                sx={{ backgroundColor: notification.read ? "#f5f5f5" : "#fff" }}
              >
                <ListItemText primary={notification.message} />
              </MenuItem>
            ))
          )}
          <Divider />
          <MenuItem onClick={clearAllNotifications}>
            <ListItemIcon>
              <MarkAsReadIcon />
            </ListItemIcon>
            <ListItemText primary="Mark All as Read" />
          </MenuItem>
        </Menu>

        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {getFullName()}
          </Typography>
          <IconButton onClick={() => navigate("/profile")}>
            {user?.profilePic ? (
              <Avatar src={user.profilePic} alt={user.firstName} />
            ) : (
              <Avatar>{getInitials()}</Avatar>
            )}
          </IconButton>
        </Box>

        {/* Logout Button */}
        <IconButton color="inherit" onClick={logOut}>
          <LogoutIcon />
        </IconButton>

      </Toolbar>
    </AppBar>

  )
}
Header.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default Header;