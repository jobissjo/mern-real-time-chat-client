import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createNewChat } from '../../../apiCalls/chat';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import { setAllChats, setSelectedChat } from '../../../redux/userSlice';
import moment from 'moment';
import store from '../../../redux/store';
import { sendFriendRequest } from '../../../apiCalls/friendRequest';
import { getNotChattedFriendsList } from '../../../apiCalls/user';

import PropTypes from 'prop-types';

const UserList = ({ searchKey, socket, onlineUsers }) => {
    const { allUsers, allChats, user: currentUser, selectedChat } = useSelector(state => state.userReducer);
    const [showFriends, setShowFriends] = useState(false); // Minimize/expand friends list
    const [showChats, setShowChats] = useState(true); // Minimize/expand chat list
    const dispatch = useDispatch();
    const [friendsNotChattedYet, setFriendsNotChattedYet] = useState([]);

    const startNewChat = async (member_id) => {
        try {
            const members = [currentUser._id, member_id];
            const [response, status_code] = await createNewChat(members);

            if (status_code === 200) {
                toast.success("Chat started successfully");
            } else {
                toast.error(response.message);
                const newChat = response.data;
                const updatedChat = [...allChats, newChat];
                dispatch(setAllChats(updatedChat));
                dispatch(setSelectedChat(newChat));
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const getLastMessage = (userId) => {
        const chat = allChats?.find(chat => chat?.members?.map(u => u._id).includes(userId));
        if (!chat) return '';
        if (!chat?.lastMessage) return '';
        return chat?.lastMessage?.sender === currentUser._id
            ? `You: ${chat?.lastMessage?.text?.substring(0, 25)}`
            : chat?.lastMessage?.text?.substring(0, 25);
    };

    const openChat = (selected_user_id) => {
        const chat = allChats.find(chat => chat.members.map(u => u._id).includes(currentUser._id) && chat.members.map(u => u._id).includes(selected_user_id));
        if (chat) {
            dispatch(setSelectedChat(chat));
        }
    };

    const getUnreadMessageCount = (userId) => {
        const chat = allChats?.find(chat => chat?.members?.map(m => m._id).includes(userId));
        if (chat?.unreadMessageCount && chat?.lastMessage?.sender !== currentUser._id) {
            return <div className='unread-message-count'>{chat.unreadMessageCount}</div>;
        }
        return "";
    };

    const getChatListData = () => {
        if (searchKey === "") {
            return allChats;
        } else {
            const filteredChats = allChats.filter(chat => {
                const member = chat.members.filter(member => member._id != currentUser._id)[0];             
                
                return  member?.firstName?.toLowerCase().includes(searchKey.toLowerCase()) || member.lastName?.toLowerCase().includes(searchKey.toLowerCase());
            })
            return filteredChats;
            
            // return allUsers.filter(user => user.firstName.toLowerCase().includes(searchKey.toLowerCase()) || user.lastName.toLowerCase().includes(searchKey.toLowerCase()));
        }
    };

    useEffect(() => {
        getNotChattedFriendList()
    }, [])



    const getNotChattedFriendList = async () => {
        try {
            const response = await getNotChattedFriendsList();
            if (response.status === 200) {
                setFriendsNotChattedYet(response.data.data);
            }
        }
        catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <>
            <div className="user-list-container">
                {/* Chat List Header (Collapsible) */}
                <div className="chat-list-header" onClick={() => setShowChats(!showChats)}>
                    <span>Chats</span>
                    <i className={`fa ${showChats ? 'fa-chevron-down' : 'fa-chevron-up'}`} />
                </div>

                {/* Chat List (Collapsible) */}
                {showChats && (
                    <div className="chat-list">
                        {getChatListData()?.map(obj => {
                            let user = obj;
                            if (obj.members) {
                                user = obj.members.find(mem => mem._id !== currentUser._id);
                            }
                            return (
                                <div className="user-search-filter" onClick={() => openChat(user._id)} key={user._id}>
                                    <div className="filtered-user">
                                        <div className="filter-user-display">
                                            {user.profilePic
                                                ? <img src={user.profilePic} alt="Profile Pic" className="user-profile-image"
                                                    style={onlineUsers.includes(user._id) ? { border: '3px solid #82e0aa' } : {}} />
                                                : <div className="user-default-avatar"
                                                    style={onlineUsers.includes(user._id) ? { border: '3px solid #82e0aa' } : {}}>
                                                    {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                                                </div>
                                            }

                                            <div className="filter-user-details">
                                                <div className="user-display-name">{user.firstName} {user.lastName}</div>
                                                <div className="user-display-email">{getLastMessage(user._id) || user.email}</div>
                                            </div>
                                            <div>
                                                {getUnreadMessageCount(user._id)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Friend List Header (Collapsible) */}
                <div className="friend-list-container">
                    <div className="friend-list-header" onClick={() => setShowFriends(!showFriends)}>
                        <span>Friends (Not Chatted Yet)</span>
                        <i className={`fa ${showFriends ? 'fa-chevron-down' : 'fa-chevron-up'}`} />
                    </div>

                    {/* Friend List (Collapsible) */}
                    {showFriends && (
                        <div className="friend-list">
                            {friendsNotChattedYet.map(friend => (
                                <div className="friend-item" key={friend._id}>
                                    <div className="friend-details">
                                        {friend.profilePic
                                            ? <img src={friend.profilePic} alt="Profile Pic" className="friend-profile-image" />
                                            : <div className="friend-avatar">
                                                {friend.firstName.charAt(0).toUpperCase()}{friend.lastName.charAt(0).toUpperCase()}
                                            </div>
                                        }
                                        <div className="friend-info">
                                            <div className="friend-name">{friend.firstName} {friend.lastName}</div>
                                        </div>
                                    </div>
                                    <button className="start-chat-btn" onClick={() => startNewChat(friend._id)}>Start Chat</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {
                searchKey && 
                <div className='search-global-users'>
                    <div>iiiiiiiiiiiiii</div>

                </div>
            }
        </>
    );
}

UserList.propTypes = {
    searchKey: PropTypes.string.isRequired,
    socket: PropTypes.object,
    onlineUsers: PropTypes.array
};

export default UserList;
