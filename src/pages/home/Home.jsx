import React, { useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const Home = () => {
  const { selectedChat } = useSelector((state) => state.userReducer);
  const socket = io('http://localhost:5000');

  useEffect(()=> {
    socket.emit('send-message-all', {
      text: 'hi from jobi'
    });
    socket.on("send-message-by-server", (data)=> {
      console.log(data);
      
    })
  }, [])

  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
          <Sidebar/>
          
          {selectedChat && <ChatArea />}
      </div>
  </div>
  )
}

export default Home