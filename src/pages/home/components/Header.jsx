import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { clearAllNotificationOfUser, getAllNotification, readNotification } from '../../../apiCalls/notification';
import toast from 'react-hot-toast';
import { Notifications as NotificationsIcon,  PowerSettingsNew as LogoutIcon,
   Brightness4 as DarkModeIcon,Chat as ChatIcon,
} from "@mui/icons-material";
import { getUserPreferences, updateUserPreferences } from '../../../apiCalls/preference';
import {
  AppBar, Toolbar,  Typography,  IconButton,
  Badge, Menu,   MenuItem,   Switch,
  Avatar, Box,   Divider, ListItemIcon, ListItemText,
} from "@mui/material";

const Header = ({socket}) => {
    const { user } = useSelector(state => state.userReducer);
    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    function getFullName(){
        return user.firstName + " " + user.lastName;
    }


    function getInitials(){
        return user.firstName?.toUpperCase().charAt(0) + user.lastName?.toUpperCase().charAt(0);
    }
    const logOut = async ()=> {
      localStorage.removeItem('token')
      navigate('/login');
      socket.emit('user-logout', user._id)
        
    }
    // GET NOTIFICATION
    const getNotification = async ()=> {
      try{
        let response = await getAllNotification()
        if(response.status === 200){
          setNotifications(response.data?.data)
        }
      }
      catch(error){
        console.log(error)
      }
    }
    // UPDATE DARK THEME
    const updatePreference = async ()=> {
      try{
        let response = await updateUserPreferences({isDarkMode: !darkMode})
        if(response.status === 200){
          toast.success(response.data?.message)
          getPreference()
          
        }
      }
      catch(error){
        toast.error(error.message)
      }
    }

    useEffect(()=> {
      getNotification();
      getPreference();
    }, [showNotification, unreadNotificationCount])

    const markReadNotification = async (notificationId)=> {
      try{
        let response = await readNotification(notificationId);
        if(response.status === 200){
          setUnreadNotificationCount(unreadNotificationCount - 1)
        }
        else{
          toast.error(response.error.message)
        }
      }
      catch(error){
        console.log(error)
      } 
    }

    // FETCH USER PREFERENCE  
    const getPreference = async () => {
      try{
        let response = await getUserPreferences()
        if(response.status === 200){
          setDarkMode(response.data?.data?.isDarkMode)
        }
        else{
          toast.error(response.error.message)
        }
      }catch(error){
        console.error('Error fetching preferences:', error);
      }
    }

    const clearAllNotifications = async () => {
      try{
        let response = await clearAllNotificationOfUser()
        if(response.status === 200){
          toast.success(response.data?.message ?? 'All notifications cleared')
          setUnreadNotificationCount(0);
          getNotification();
        }
      }
      catch(error){
        console.log(error)
      }
    }
    
  return (
    <div className="app-header">
    <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true" onClick={()=> {navigate('/')}} style={{cursor:'pointer'}}></i>
          Quick Chat
    </div>
    <div className="app-user-profile">
        <Switch
          checked={darkMode}
          onChange={() => updatePreference()}
          color="default"
        />
      <div className="notification-container">
        <div className='notification-icon' onClick={()=> setShowNotification(!showNotification)}>
          <i className="fa fa-bell" aria-hidden="true"></i>
        </div>
        { showNotification && 
          <div className="notification-dropdown">
            <div className="notification-header">
                <span>Notifications</span>
                <button onClick={clearAllNotifications}>Mark All as Read</button>
            </div>
            <ul className="notification-list">
              {
                
                (!notifications || notifications.length === 0) ?
                ( <li className="no-notifications">No new notifications</li>) :
                (notifications.map((notification) => (
                  <li key={notification._id} onClick={()=> {markReadNotification(notification._id)}} className={notification.read ? "read" : "unread"} >
                    {notification.message}
                  </li>
                )))
              }
            </ul>


          </div>
        }
      </div>
        
        <div className="logged-user-name">{getFullName()}</div>
        {
          !user?.profilePic && <div className="logged-user-profile-pic" onClick={e => {navigate('/profile')}} >{getInitials()}</div>
        }
        { user?.profilePic && 
          <img className="logged-user-profile-pic" src={user?.profilePic} alt={user?.firstName} onClick={e => {navigate('/profile')}} />

        }
        <button className='logout-button' onClick={logOut}>
          <i className='fa fa-power-off'></i>
        </button>
    
    </div>
  
  </div>

  )
}

export default Header;