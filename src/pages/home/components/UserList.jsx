import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createNewChat } from '../../../apiCalls/chat';
import { setAllChats, setSelectedChat } from '../../../redux/userSlice';
import { getNotChattedFriendsList } from '../../../apiCalls/user';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Badge,
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserList = ({ searchKey, onlineUsers, socket }) => {
  const { allChats, user: currentUser, selectedChat } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [friendsNotChattedYet, setFriendsNotChattedYet] = useState([]);

  useEffect(() => {
    fetchNotChattedFriends();
  }, []);

  const fetchNotChattedFriends = async () => {
    try {
      const response = await getNotChattedFriendsList();
      if (response.status === 200) {
        setFriendsNotChattedYet(response.data.data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const startNewChat = async (member_id) => {
    try {
      const members = [currentUser._id, member_id];
      const [response, status_code] = await createNewChat(members);
      if (status_code === 200) {
        toast.success('Chat started successfully');
      } else {
        toast.error(response.message);
        const newChat = response.data;
        dispatch(setAllChats([...allChats, newChat]));
        dispatch(setSelectedChat(newChat));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openChat = (selectedUserId) => {
    const chat = allChats.find((chat) => chat.members.some((mem) => mem._id === selectedUserId));
    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  };

  useEffect(() => {

    const handleMsgCountUpdated = (message) => {
      console.log('message:', message, "allChats", allChats);
      
      let tempAllChats = allChats.map((chat) => chat);

      if (message.ChatId != selectedChat?._id) {
        const updatedChats = tempAllChats?.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              unreadMessageCount: chat?.unreadMessageCount ? chat.unreadMessageCount + 1 : 1,
              lastMessage: message
            }
          }
          return chat;
        });
        tempAllChats = updatedChats;

        let latestChat = tempAllChats.find(chat => chat._id === message.chatId);
        let otherChats = tempAllChats.filter(chat => chat._id !== message.chatId);

        tempAllChats = [latestChat, ...otherChats];
      }
      console.log("tempAllChats", tempAllChats);
      
      dispatch(setAllChats(tempAllChats));
    }

    socket.on('message-count-updated', handleMsgCountUpdated)

    return () => {
      socket.off('message-count-updated', handleMsgCountUpdated)
    }
  }, [allChats, selectedChat])

  const getChatListData = () => {
    if (!searchKey) return allChats;
    return allChats.filter((chat) => {
      const member = chat.members.find((mem) => mem._id !== currentUser._id);
      return (
        member?.firstName?.toLowerCase().includes(searchKey.toLowerCase()) ||
        member?.lastName?.toLowerCase().includes(searchKey.toLowerCase())
      );
    });
  };

  return (
    <Box sx={{ backgroundColor: 'var(--primary-color)', borderRadius: '8px', p: 2, }}>
      {/* Chat List */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: 'var(--primary-color)' }}>
          <Typography variant="h6">Chats</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ backgroundColor: 'var(--primary-color)', color: "var(--text-color)" }} >
          <List sx={{ backgroundColor: 'var(--primary-color)', borderRadius: '8px',  color: "var(--text-color)" }}>
            {getChatListData()?.map((chat, index) => {
              const user = chat.members.find((mem) => mem._id !== currentUser._id);
              let messageOrMail;
              if (chat?.lastMessage) {
                messageOrMail =
                  chat?.lastMessage?.sender === currentUser._id
                    ? `You: ${chat?.lastMessage?.text}`
                    : chat?.lastMessage?.text;
              } else {
                messageOrMail = currentUser.email;
              }
              return (
                <React.Fragment key={user._id}>
                  <ListItem onClick={() => openChat(user._id)} sx={{ cursor: 'pointer' }}>
                    <ListItemAvatar>
                      <Badge color="success" variant={onlineUsers.includes(user._id) ? 'dot' : 'standard'}>
                        <Avatar src={user.profilePic}>{user.firstName[0]}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      style={{color: 'var(--text-color)'}}
                      primary={`${user.firstName} ${user.lastName}`}
                      secondary={messageOrMail}
                    />
                  </ListItem>
                  {index < getChatListData().length - 1 && <Divider />} {/* Add divider between chat items */}
                </React.Fragment>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Friends List */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: 'var(--primary-color)' }}>
          <Typography variant="h6">Friends</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ backgroundColor: 'var(--primary-color)' }}>
          <List sx={{ backgroundColor: 'var(--primary-color)', borderRadius: '8px' }}>
            {friendsNotChattedYet.map((friend, index) => (
              <React.Fragment key={friend._id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={friend.profilePic}>{friend.firstName[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${friend.firstName} ${friend.lastName}`} />
                  <Button variant="contained" color="primary" onClick={() => startNewChat(friend._id)}>
                    Start Chat
                  </Button>
                </ListItem>
                {index < friendsNotChattedYet.length - 1 && <Divider />} {/* Add divider between friend items */}
              </React.Fragment>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

UserList.propTypes = {
  searchKey: PropTypes.string.isRequired,
  onlineUsers: PropTypes.array.isRequired,
  socket: PropTypes.object.isRequired,
};

export default UserList;