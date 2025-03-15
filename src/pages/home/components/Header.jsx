import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'
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

const Header = ({ socket }) => {
  const { user } = useSelector(state => state.userReducer);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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
  // UPDATE DARK THEME
  const updatePreference = async () => {
    try {
      let response = await updateUserPreferences({ isDarkMode: !darkMode })
      if (response.status === 200) {
        toast.success(response.data?.message)
        getPreference()

      }
    }
    catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getNotification();
    getPreference();
  }, [showNotification, unreadNotificationCount])

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
  const getPreference = async () => {
    try {
      let response = await getUserPreferences()
      if (response.status === 200) {
        setDarkMode(response.data?.data?.isDarkMode);
        if(darkMode){
          
          document.body.classList.toggle('dark-mode');
        }
      }
      else {
        toast.error(response.error.message)
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  }

  const clearAllNotifications = async () => {
    try {
      let response = await clearAllNotificationOfUser()
      if (response.status === 200) {
        toast.success(response.data?.message ?? 'All notifications cleared')
        setUnreadNotificationCount(0);
        getNotification();
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: darkMode ? "#121212" : "var(--secondary-color);" }}>
      <Toolbar>
        <IconButton color="inherit" onClick={() => navigate("/")}>
          <ChatIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Quick Chat
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <DarkModeIcon sx={{ mr: 1 }} />
          <Switch checked={darkMode} onChange={updatePreference} color="default" />
        </Box>

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