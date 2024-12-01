import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { createNewMessage } from '../../../apiCalls/message';
import toast from 'react-hot-toast';
import { getAllMessages } from '../../../apiCalls/message';
import moment from 'moment';
import { clearUnreadMessageCount } from '../../../apiCalls/chat';


const ChatArea = () => {
  const { selectedChat, user, allChats } = useSelector((state) => state.userReducer);
  const selectedUser = selectedChat?.members?.find(u => u._id != user._id);
  const [message, setMessage] = useState('');
  const [allMessage, setAllMessage] = useState([]);

  const dispatch = useDispatch();

  const getAllMessageOfSelectedChat = async (chatId) => {
    try {

      dispatch(showLoader());
      const [response, status_code] = await getAllMessages(selectedChat._id)
      dispatch(hideLoader());
      if (status_code === 200) {
        console.log("message response", response.data);
        setAllMessage(response.data);
      }
      else {
        dispatch(hideLoader());
        setAllMessage([])
      }
    } catch (err) {
      dispatch(hideLoader());
      console.warn("error occurred")
    }
  }

  const formatTime = (timestamp) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), 'days');

    if(diff < 1){
      return `Today ${moment(timestamp).format('hh:mm A')}`;
    }else if(diff > 1){
      return `Yesterday ${moment(timestamp).format('hh:mm A')}`;
    }else{
      return moment(timestamp).format("MMMM D, hh:mm A");
    }
  }


  useEffect(() => {
    getAllMessageOfSelectedChat(selectedChat._id);
    if (selectedChat?.lastMessage?.sender !== user._id){
      clearUnreadMessage();
    }
  }, [selectedChat])

  const sendMessage = async () => {
    try {
      const messageBody = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
      }
      dispatch(showLoader());
      const response = await createNewMessage(messageBody);
      setMessage('')
      dispatch(hideLoader());
    } catch (err) {
      dispatch(hideLoader());
      toast.error(error.message)
    }
  }

  const clearUnreadMessage = async () => {
    try {
      dispatch(showLoader());
      const [response, status_code] = await clearUnreadMessageCount(selectedChat._id);
      dispatch(hideLoader());

      if (status_code === 200){
        allChats.map(chat => {
          if (chat._id === selectedChat._id){
            return response.data;
          }
          return chat;
        })
      }else{
        toast.error(error.message)
      }

    } catch (err) {

      dispatch(hideLoader());
      toast.error(err.message)
    }
  }

  return (
    <>
      {
        selectedChat && <div className='app-chat-area'>
          <div className='app-chat-area-header'>
            {selectedUser?.firstName} {selectedChat?.lastName}
          </div>
          <div className='main-chat-area'>
            {allMessage.map(message => {
              let isCurrentUserSender = message.sender == user._id
              return <div className="message-container" key={message._id}
              style={isCurrentUserSender ? {justifyContent: 'end'}: {justifyContent: 'start'}}>

                <div className={isCurrentUserSender ? "send-message": "received-message"} >
                  <div>{message.text}</div>
                  </div>
                <div className='message-timestamp' 
                style={ isCurrentUserSender ? {float: 'right'}: {float: 'left'}}>
                  {formatTime(message.timestamp)} 
                  {isCurrentUserSender && message.read && 
                  <i className='fa fa-check-circle' aria-hidden="true" 
                    style={{color: '#e74c3c'}}></i>}
                </div>
                </div>
            })}
          </div>
          <div className="send-message-div">
            <input type="text" value={message} className="send-message-input"
              placeholder="Type a message" onChange={(event) => {
                setMessage(event.target.value)
              }} />
            <button
              className="fa fa-paper-plane send-message-btn" aria-hidden="true"
              onClick={sendMessage}></button>
          </div>
        </div>
      }
    </>
  )
}

export default ChatArea