import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useMediaQuery } from '@mui/material';

const socket = io('ws://192.168.1.40:5000/');

const Home = () => {
  const { user, selectedChat } = useSelector((state) => state.userReducer);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  

  useEffect(()=> {
    if(user?._id){
      socket.emit('join-room', user._id);
      socket.emit('user-login', user._id);
      socket.on('online-users', usersData=>{
        setOnlineUsers(usersData);
      })

      return ()=> {
        socket.emit('user-logout', user._id);
        socket.off('online-users');
        socket.off('user-login');
        socket.disconnect()
      }
    }
  }, [user])

  return (
    <div className="home-page">
      <Header socket={socket} />
      <div className="main-content">
          {
            isMobile ? (
              selectedChat ? (
                <ChatArea socket={socket} />
              ) : (
                <Sidebar socket={socket} onlineUsers={onlineUsers} />
              )
            ):(
              <>
              <Sidebar socket={socket} onlineUsers={onlineUsers} />
          
              {selectedChat && <ChatArea socket={socket} />}
              </>
            )}
      </div>
  </div>
  )
}

export default Home