import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createNewChat } from '../../../apiCalls/chat';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { setAllChats, setSelectedChat } from '../../../redux/userSlice';

const UserList = ({searchKey}) => {
  const {allUsers, allChats, user:currentUser } =  useSelector(state => state.userReducer);
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

  const openChat = async (selected_user_id) => {
    
    try {
        const chat = allChats.find(chat => {
            return chat.members.includes(currentUser._id) && chat.members.includes(selected_user_id)
        })
        if(chat){
            dispatch(setSelectedChat(chat));
        }

    } catch(err){

    }
  }


  return (
    allUsers
    .filter(user => {
      return ( 
        (user.firstName.toLowerCase().includes(searchKey.toLowerCase())
        || user.lastName.toLowerCase().includes(searchKey.toLowerCase())) &&
        searchKey)

          ||  allChats.some(chat => chat.members.includes(user._id))
    })
    .map(user => {
        return <div className="user-search-filter" onClick={()=> openChat(user._id)} key={user._id}>
        <div className="filtered-user">
            <div className="filter-user-display">
                 { user.avatarUrl && <img src={user.profilePic} alt="Profile Pic" className="user-profile-image"></img>}
                 { !user.avatarUrl && <div className="user-default-profile-pic">
                    {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </div>}
                <div className="filter-user-details">
                    <div className="user-display-name">{user.firstName} {user.lastName }</div>
                    <div className="user-display-email">{user.email}</div>
                </div>
                {
                    !allChats.find(chat=> chat.members.includes(user._id)) &&

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