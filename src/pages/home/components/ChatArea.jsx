import React from 'react'
import { useSelector } from 'react-redux'

const ChatArea = () => {
  const {selectedChat} = useSelector((state)=> state.userReducer);
  return (
    <div>Chat {selectedChat?._id}</div>
  )
}

export default ChatArea