import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createNewChat } from '../../../apiCalls/chat';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { setAllChats,  setSelectedChat } from '../../../redux/userSlice';
import moment from 'moment';

const UserList = ({searchKey}) => {
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
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId));

        if(!chat || !chat?.lastMessage){
            return "";
        }else{
            return moment(chat?.lastMessage?.createdAt).format('hh:mm A');
        }
    }

  const getLastMessage = (userId)=> {
    const chat = allChats.find(chat => chat.members.map(u => u._id).includes(userId));

    console.log(userId, chat);
    

    if (!chat) {
        return ''
    }
   console.log('who',  chat.sender == currentUser._id);
   
    if (chat?.lastMessage?.sender == currentUser._id){
        
        return `You: ${ chat?.lastMessage.text?.substring(0,25) }`
    }else{
        return  chat?.lastMessage.text?.substring(0,25);
    }
  }

  

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
    if(selectedChat){
        return selectedChat.members.map(u => u._id).includes(user._id)
    }
    return false;
  }


  return (
    allUsers
    .filter(user => {
      return ( 
        (user.firstName.toLowerCase().includes(searchKey.toLowerCase())
        || user.lastName.toLowerCase().includes(searchKey.toLowerCase())) &&
        searchKey)

          ||  allChats.some(chat => {
            console.log(chat.members);
            
            return chat.members?.map(m => m._id).includes(user._id)
          })
    })
    .map(user => {
        return <div className="user-search-filter" onClick={()=> openChat(user._id)} key={user._id}>
        <div className={!IsSelectedChat(user) ? "filtered-user" : "selected-user"}>
            <div className="filter-user-display">
                 { user.avatarUrl && <img src={user.profilePic} alt="Profile Pic" className="user-profile-image"></img>}
                 { !user.avatarUrl && <div className={!IsSelectedChat(user) ? "user-default-avatar" : "selected-user-avatar"}>
                    {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </div>}
                
                <div className="filter-user-details">
                    <div className="user-display-name">{user.firstName} {user.lastName }</div>
                    <div className="user-display-email">{ getLastMessage(user._id) || user.email}</div>
                </div>
                <div className='last-message-timestamp'>{getLastMessageTimeStamp(user._id)}</div>
                {
                    !allChats.find(chat=> chat.members.map(u=> u._id).includes(user._id)) &&

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