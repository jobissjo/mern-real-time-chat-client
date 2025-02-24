import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux'
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { createNewMessage } from '../../../apiCalls/message';
import toast from 'react-hot-toast';
import { getAllMessages } from '../../../apiCalls/message';
import moment from 'moment';
import { clearUnreadMessageCount } from '../../../apiCalls/chat';
import store from '../../../redux/store';
import { setAllMessages } from '../../../redux/userSlice';
import EmojiPicker from 'emoji-picker-react';

const ChatArea = ({socket}) => {
  const { selectedChat, user, allChats } = useSelector((state) => state.userReducer);
  const selectedUser = selectedChat?.members?.find(u => u._id != user._id);
  const [message, setMessage] = useState('');
  const [allMessage, setAllMessage] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isEmoji, setIsEmoji] = useState(false);
  const [typingData, setTypingData] = useState(null)

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

    // .off('receive-message')
    socket.off('receive-message').on('receive-message', (message) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      if (selectedChat._id === message.chatId){
        setAllMessage(prevMessage => {
        
          return [...prevMessage, message]
        })
      }
      if(selectedChat?._id === message.chatId && message.sender !== user._id){
        clearUnreadMessage();

      }
      
      
    })

    socket.on("message-count-cleared", (data)=> {
      const selectedChat = store.getState().userReducer.selectedChat;
      const allChats = store.getState().userReducer.allChats;

      if(selectedChat?._id === data.chatId){
        const updatedChats = allChats.map(chat => {
          if(chat._id === data.chatId){
            return {...chat, unreadMessageCount: 0}
          }
          return chat;
        });
        console.log("updated chat in chatarea list:", updatedChats);
        
        dispatch(setAllMessages(updatedChats));

        setAllMessage(prevMessage => {
          return prevMessage.map((msg) => {
            return {...msg, read:true}
          })
        })
      }
    })

    socket.on('started-typing', (data) => {
      if(selectedChat._id === data.chatId && data.sender !== user._id){
        console.log(
          "ddddddddddddddddddd", data
        );
        
        setIsTyping(true);
        setTypingData(data);
        setTimeout(() => {
          setIsTyping(false);
        }, 1000)
      }
        

    })
  }, [selectedChat, isTyping, isEmoji]);

  useEffect(() =>{
    const mainChatAreaContianer = document.getElementById("main-chat-area");
    mainChatAreaContianer.scrollTop = mainChatAreaContianer.scrollHeight;

  },[allMessage])

  const sendMessage = async (image) => {
    try {
      const messageBody = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
        image: image
      }
      console.log("member ids:", selectedChat?.members.map(el => el._id));
      
      socket.emit('send-message', {
        ...messageBody,
        members: selectedChat?.members.map(el => el._id),
        read: false,
        createdAt: moment().format('DD-MM-YYYY HH:mm:ss')
      })
      const response = await createNewMessage(messageBody);
      setMessage('')

    } catch (err) {

      toast.error(err.message)
    }
  }

  const clearUnreadMessage = async () => {
    try {
      socket.emit('clear-unread-message', {
        chatId: selectedChat._id,
        members: selectedChat?.members.map(el => el._id)
      })
      const [response, status_code] = await clearUnreadMessageCount(selectedChat._id);


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

      toast.error(err.message)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  const toggleIconElement = ()=> {
    setIsEmoji(!isEmoji);
  }

  const sendImage = async (e)=> {
    debugger
    const file = e.target.files[0];
    if (!file){
      toast.error("Please select an image");
      return
    }
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    console.log('Image loaded');
    
    reader.onloadend = async () => {
      sendMessage(reader.result);
    }

  }

  return (
    <>
      {
        selectedChat && <div className='app-chat-area'>
          <div className='app-chat-area-header'>
            {selectedUser?.firstName} {selectedChat?.lastName}
          </div>
          <div className='main-chat-area' id='main-chat-area'>
          {allMessage.map((message, index) => {
            let isCurrentUserSender = message.sender == user._id;
            return (
              <div className="message-container" 
                key={message._id || `temp-${index}`} // Use message._id if available, else fallback to index
                style={isCurrentUserSender ? { justifyContent: 'end' } : { justifyContent: 'start' }}>
                
                <div className={isCurrentUserSender ? "send-message" : "received-message"}>
                  <div>{message.text}</div>
                  <div>{message.image && <img src={message.image} alt='image' height="120" width="120" />}</div>
                </div>
                
                <div className='message-timestamp' 
                  style={isCurrentUserSender ? { float: 'right' } : { float: 'left' }}>
                  {formatTime(message.timestamp)} 
                  {isCurrentUserSender && message.read && 
                    <i className='fa fa-check-circle' aria-hidden="true" style={{ color: '#e74c3c' }}></i>}
                </div>
              </div>
            );
          })}
          <div className='typing-indicator'>{ isTyping && selectedChat.members.map(m => m._id).includes(typingData?.sender) && <i>typing....</i>}</div>
          {
            isEmoji && <div style={{display: 'flex', justifyContent:'right'}}>
              <EmojiPicker onEmojiClick={(emoji)=> setMessage(message+emoji.emoji)}  />
            </div>
          }
          </div>
          <div className="send-message-div">
            <input type="text" value={message} className="send-message-input"
              placeholder="Type a message" 
              onChange={(event) => {
                setMessage(event.target.value)
                socket.emit('user-typing', {
                  chatId: selectedChat._id,
                  members: selectedChat.members.map(mem=> mem._id),
                  sender: user._id
                })
              }} onKeyDown={handleKeyDown} />
            
            <label htmlFor="send-image-input">
              <i className='fa fa-picture-o send-image-btn'></i>
              <input type="file" id="send-image-input" accept="image/*" style={{ display: 'none' }}
                onChange={sendImage}/>
            </label>
              
            
            <button
              className="fa fa-smile-o send-emoji-btn" 
              onClick={toggleIconElement}></button>
            <button
              className="fa fa-paper-plane send-message-btn" aria-hidden="true"
              onClick={()=> {sendMessage('')}}></button>
          </div>
        </div>
      }
    </>
  )
}
ChatArea.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default ChatArea
