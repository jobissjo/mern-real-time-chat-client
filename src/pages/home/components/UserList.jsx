import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createNewChat, getChatMessage } from '../../../apiCalls/chat';
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
import Skeleton from '@mui/material/Skeleton';
import { decryptMessage } from '../../../utils/encryption';


const UserList = ({ searchKey, onlineUsers, socket }) => {
  const { allChats, user: currentUser, selectedChat } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [friendsNotChattedYet, setFriendsNotChattedYet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [decryptedAllChats, setDecryptedAllChats] = useState([]);

  useEffect(() => {
    fetchNotChattedFriends();
    decryptingAllChats(allChats);
  }, []);

  const fetchNotChattedFriends = async () => {
    try {
      setIsLoading(true);
      const response = await getNotChattedFriendsList();
      setIsLoading(false)
      if (response.status === 200) {
        setFriendsNotChattedYet(response.data.data);
      }
    } catch (err) {
      setIsLoading(false)
      toast.error(err.message);
    }
  };

  const startNewChat = async (member_id) => {
    try {
      const members = [currentUser._id, member_id];
      const [response, status_code] = await createNewChat(members);
      if (status_code === 201) {
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

    const handleReceiveMessage = async (message) => {
      const parsedText = JSON.parse(message?.text);
      // const chatInfo = await getChatMessage(message?.chatId);
      
      
      const chatInfo = allChats?.filter(chat => chat._id === message.chatId)[0]
      console.log('parsedText', parsedText, "chatInfo", chatInfo);
      const decryptedMessage = await decryptMessage(parsedText.encryptedMessage, parsedText.iv, chatInfo.encryptedKey);
      const decryptedLastMsg = {...message, text: decryptedMessage}

      const allDecryptedChats = decryptedAllChats?.map(decryptChat => {
        if (decryptChat._id === message.chatId) {
          return {
           ...decryptChat,
            unreadMessageCount: decryptChat?.unreadMessageCount? decryptChat.unreadMessageCount + 1 : 1,
            lastMessage: decryptedLastMsg
          }
        }
        return decryptChat;
      })

      setDecryptedAllChats(allDecryptedChats)
      
    }

    socket.on('message-count-updated', handleMsgCountUpdated);
    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('message-count-updated', handleMsgCountUpdated);
      socket.off('receive-message', handleReceiveMessage);
    }
  }, [allChats, selectedChat])

  const decryptingAllChats = async (allChatList) => {

    allChatList = await Promise.all(allChatList.map(async (chat) => {
      if (chat.lastMessage) {
        const parsedText = JSON.parse(chat.lastMessage.text);
        const decryptedMessage = await decryptMessage(parsedText.encryptedMessage, parsedText.iv, chat.encryptedKey);
        const lastMessage = {...chat.lastMessage, text: decryptedMessage}
        chat = {...chat, lastMessage }
      }
      return chat;
    }))
    console.log(allChatList, 'all chat list');
    
    if (searchKey) {
      allChatList.filter((chat) => {
        const member = chat.members.find((mem) => mem._id !== currentUser._id);
        return (
          member?.firstName?.toLowerCase().includes(searchKey.toLowerCase()) ||
          member?.lastName?.toLowerCase().includes(searchKey.toLowerCase())
        );
      });
    }
    console.log("decrypting message:", allChatList);

    setDecryptedAllChats(allChatList);

  }


  return (
    <>
      {isLoading ? (
        <Box sx={{ backgroundColor: 'var(--primary-color)', borderRadius: '8px', p: 2 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: 'var(--primary-color)' }}>
              <Typography variant="h6">Chats</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: 'var(--primary-color)', color: "var(--text-color)" }}>
              {[1, 2, 3].map((item) => (
                <React.Fragment key={item}>
                  <ListItem>
                    <ListItemAvatar>
                      <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Skeleton variant="text" width="60%" />}
                      secondary={<Skeleton variant="text" width="40%" />}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: 'var(--primary-color)' }}>
              <Typography variant="h6">Friends</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: 'var(--primary-color)' }}>
              {[1].map((item) => (
                <React.Fragment key={item}>
                  <ListItem>
                    <ListItemAvatar>
                      <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText primary={<Skeleton variant="text" width="60%" />} />
                    <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </AccordionDetails>
          </Accordion>

        </Box>
      )
        :
        <Box sx={{ backgroundColor: 'var(--primary-color)', borderRadius: '8px', p: 2, }}>
          {/* Chat List */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: 'var(--primary-color)' }}>
              <Typography variant="h6" style={{color: 'var(--text-color)'}}>Chats</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: 'var(--primary-color)', color: "var(--text-color)" }} >
              <List sx={{ backgroundColor: 'var(--primary-color)', borderRadius: '8px', color: "var(--text-color)" }}>
                {decryptedAllChats?.map((chat, index) => {
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
                          sx={{color: 'var(--text-color)', '& .MuiListItemText-secondary': {
                            color: 'var(--sub-text-color)',
                          }}}
                          primary={`${user.firstName} ${user.lastName}`}
                          secondary={messageOrMail}
                        />
                      </ListItem>
                      {index < decryptedAllChats.length - 1 && <Divider />} {/* Add divider between chat items */}
                    </React.Fragment>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Friends List */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: 'var(--primary-color)' }}>
              <Typography variant="h6" style={{color: 'var(--text-color)'}}>Friends</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: 'var(--primary-color)' }}>
              <List sx={{ backgroundColor: 'var(--primary-color)', borderRadius: '8px' }}>
                {friendsNotChattedYet.map((friend, index) => (
                  <React.Fragment key={friend._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={friend.profilePic}>{friend.firstName[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText sx={{color: 'var(--text-color)', '& .MuiListItemText-secondary': {
                            color: 'var(--sub-text-color)',
                          }}} primary={`${friend.firstName} ${friend.lastName}`} />
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
      }
    </>
  );
};

UserList.propTypes = {
  searchKey: PropTypes.string.isRequired,
  onlineUsers: PropTypes.array.isRequired,
  socket: PropTypes.object.isRequired,
};

export default UserList;