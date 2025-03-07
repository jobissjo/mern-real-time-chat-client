import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createNewChat } from '../../../apiCalls/chat';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { setAllChats,  setSelectedChat } from '../../../redux/userSlice';
import moment from 'moment';
import { all } from 'axios';
import store from '../../../redux/store';
import { sendFriendRequest } from '../../../apiCalls/friendRequest';
import { current } from '@reduxjs/toolkit';

const UserList = ({searchKey, socket, onlineUsers}) => {
  const {allUsers, allChats, user:currentUser, selectedChat } =  useSelector(state => state.userReducer);

  const dispatch = useDispatch();
  
  const startNewChat = async (member_id) => {

    try{
        dispatch(showLoader());
        const members = [currentUser._id, member_id];
        const [response, status_code] = await createNewChat(members);
        dispatch(hideLoader());
        
        if(status_code === 200){
            toast.success("Chat started successfully")
        }else{
            toast.error(response.message);
            const newChat = response.data;
            const updatedChat = [...allChats, newChat];
            dispatch(setAllChats(updatedChat));
            dispatch(setSelectedChat(newChat))
        }
    }catch(err){
        dispatch(hideLoader())
        toast.error(err.message)
    }
  }

  const getLastMessageTimeStamp = (userId) => {
        const chat = allChats.find(chat => chat?.members?.map(m => m._id).includes(userId));

        if(!chat || !chat?.lastMessage){
            return "";
        }else{
            return moment(chat?.lastMessage?.createdAt, "DD-MM-YYYY HH:mm:ss").format('hh:mm A');
        }
    }

  const getLastMessage = (userId)=> {
    const chat = allChats?.find(chat => chat?.members?.map(u => u._id).includes(userId));

    if (!chat) {
        return ''
    }

   if(!chat?.lastMessage){
    return ""

   }
   
    else if (chat?.lastMessage?.sender == currentUser._id){
        
        return `You: ${ chat?.lastMessage?.text?.substring(0,25) }`
    }else{
        return  chat?.lastMessage?.text?.substring(0,25);
    }
  }

  useEffect(()=> {
    socket.off('message-count-updated').on('message-count-updated', (message)=> {
        const selectedChat = store.getState().userReducer.selectedChat;
        let allChats = store.getState().userReducer.allChats;

        
        if(message.ChatId != selectedChat?._id){
            const updatedChats = allChats?.map((chat)=> {
                if(chat._id === message.chatId) {
                    return {
                        ...chat, 
                        unreadMessageCount: chat?.unreadMessageCount ? chat.unreadMessageCount + 1 : 1,
                        lastMessage: message
                    }
                }
                return chat;
            });
            allChats = updatedChats;

            let latestChat = allChats.find(chat => chat._id === message.chatId);
            let otherChats = allChats.filter(chat => chat._id !== message.chatId);

            allChats = [latestChat, ...otherChats];
        } 
        dispatch(setAllChats(allChats));
    })
  }, [])
  

  const openChat = async (selected_user_id) => {
    console.log(selected_user_id);
    
    
    try {
        const chat = allChats.find(chat => {
            console.log(chat);
            
            return chat.members.map(u => u._id).includes(currentUser._id) && chat.members.map(u => u._id).includes(selected_user_id)
        })
        if(chat){
            dispatch(setSelectedChat(chat));
            // getAllMessages(chat)
            console.log("chat",chat);
            getAllMessages(chat._id)
            
        }

    } catch(err){

    }
  }

  const IsSelectedChat = (user) =>{
    console.log("users------------------:", currentUser);
    
    if(selectedChat){
        return selectedChat?.members?.map(u => u._id).includes(user._id)
    }
    return false;
  };

  const getUnreadMessageCount = (userId) => {
    const chat = allChats?.find(chat => {
        return chat?.members?.map(m => m._id).includes(userId)
    });

    if (chat?.unreadMessageCount && chat?.lastMessage?.sender !== currentUser._id){
        return <div className='unread-message-count'>{chat.unreadMessageCount}</div>;
    }else{
        return "";
    }
  }

  function getChatListData(){
    if (searchKey === ""){
        return allChats;
    }
    else{
        console.log(searchKey, "search key", allUsers, "all users");
        
        return allUsers.filter(user => {
            return (user.firstName.toLowerCase().includes(searchKey.toLowerCase())
                || user.lastName.toLowerCase().includes(searchKey.toLowerCase()))
        })
    }
  }

  const sendFrdRequest = async (receiverId)=> {
    try{
        dispatch(showLoader());
        console.log('vvvvvvvvvvvvvvvvvv');
        
        const response = await sendFriendRequest(receiverId);
        toast.success(response.data.message);
        dispatch(hideLoader());
        console.log(response, 'rdddddddddddddddddddres');
        
    }
    catch(err){
        toast.error(err.response?.data?.message ?? 'Error in sendFriend Request');
        dispatch(hideLoader());
    }
  }


  return (
    getChatListData()
    ?.map(obj => {
        let user = obj;
        if (obj.members){
            user = obj.members.find(mem=> mem._id !== currentUser._id)
        }
        return <div className="user-search-filter" onClick={()=> openChat(user._id)} key={user._id}>
        <div className={!IsSelectedChat(user) ? "filtered-user" : "selected-user"}>
            <div className="filter-user-display">
                 { user.profilePic && <img src={user.profilePic} alt="Profile Pic" className="user-profile-image"
                    style={onlineUsers.includes(user._id) ? {border: '3px solid #82e0aa'} : {} } ></img>}
                 { !user.profilePic && <div className={!IsSelectedChat(user) ? "user-default-avatar" : "selected-user-avatar"}
                    style={onlineUsers.includes(user._id) ? {border: '3px solid #82e0aa'} : {} }>
                    {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </div>}
                
                <div className="filter-user-details">
                    <div className="user-display-name">{user.firstName} {user.lastName }</div>
                    <div className="user-display-email">{ getLastMessage(user._id) || user.email}</div>
                </div>
                <div>
                    { getUnreadMessageCount(user._id) }
                    <div className='last-message-timestamp'>{getLastMessageTimeStamp(user._id)}</div>
                </div>
                {
                    !currentUser?.friends?.map(friend=> friend._id).includes(user._id) &&
                    <div className="user-start-chat">
                        <button className="user-start-chat-btn" onClick={()=> sendFrdRequest(user._id)} style={{cursor: 'pointer'}}>
                            <i className="fa fa-user-plus" aria-hidden="true"></i>
                        </button>
                    </div>
                }
                {
                    !allChats.find(chat=> chat?.members?.map(u=> u._id).includes(user._id)) &&
                    user?.friends?.map(u=> u._id).includes(currentUser._id) &&

                    <div className="user-start-chat">
                        <button className="user-start-chat-btn" onClick={()=> startNewChat(user._id)}>
                            Start Chat
                        </button>
                    </div>
                }
                
            </div>
        </div>                        
    </div>
    })
    

  )
}

export default UserList;