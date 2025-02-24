import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Home = () => {
  const { user, selectedChat } = useSelector((state) => state.userReducer);
  const [onlineUsers, setOnlineUsers] = useState([]);
  

  useEffect(()=> {
    if(user?._id){
      socket.emit('join-room', user._id);
      socket.emit('user-login', user._id);
      socket.on('online-users', usersData=>{
        setOnlineUsers(usersData);
      })
    }
  }, [user])

  return (
    <div className="home-page">
      <Header socket={socket} />
      <div className="main-content">
          <Sidebar socket={socket} onlineUsers={onlineUsers} />
          
          {selectedChat && <ChatArea socket={socket} />}
      </div>
  </div>
  )
}

export default Home