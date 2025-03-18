import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { clearUnreadMessageCount } from "../../../apiCalls/chat";
import { setAllMessages, setSelectedChat } from "../../../redux/userSlice";
import store from "../../../redux/store";
import moment from "moment";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Menu,
  MenuItem
} from "@mui/material";
import {
  Send as SendIcon,
  InsertEmoticon as EmojiIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { encryptMessage,decryptMessage } from "../../../utils/encryption";
import Skeleton from '@mui/material/Skeleton';

const ChatArea = ({ socket }) => {
  const { selectedChat, user, allChats } = useSelector((state) => state.userReducer);
  const selectedUser = selectedChat?.members?.find((u) => u._id !== user._id);
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isEmoji, setIsEmoji] = useState(false);
  const [typingData, setTypingData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [decryptedMessages, setDecryptedMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const getAllMessageOfSelectedChat = async (chatId) => {
    try {
      setIsLoading(true);
      const [response, status_code] = await getAllMessages(chatId);
      if (status_code === 200) {
        await decryptingMessage(response.data);
        
      } else {
        setAllMessage([]);
      }
    } catch (err) {
      setIsLoading(false)
      console.warn("Error fetching messages:", err);
    }finally{
      setIsLoading(false)
    }
  };

  const decryptingMessage = async (messages) => {
    console.log(messages, selectedChat.encryptedKey, 'ccccccccccccccccccc');
    
    const decryptedMessage = await Promise.all(
      messages.map(async (m) => {
        let currentMsg = JSON.parse(m.text);
        const decrypted = await decryptMessage(currentMsg.encryptedMessage, currentMsg.iv, selectedChat.encryptedKey);
        return {...m, text:decrypted};
      })
    )
    setAllMessage(decryptedMessage)
  }

  const formatTime = (timestamp) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), "days");

    if (diff < 1) {
      return `Today ${moment(timestamp).format("hh:mm A")}`;
    } else if (diff === 1) {
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    } else {
      return moment(timestamp).format("MMMM D, hh:mm A");
    }
  };

  useEffect(() => {
    if (!selectedChat?._id) return;

    getAllMessageOfSelectedChat(selectedChat._id);

    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessage();
    }
    const handleReceiveMessage = (message) => {
      if (selectedChat._id === message.chatId) {
        setAllMessage((prevMessage) => [...prevMessage, message]);
      }
      if (selectedChat?._id === message.chatId && message.sender !== user._id) {
        clearUnreadMessage();
      }
    }

    const handleMessageCountCleared = (data) => {
      // const selectedChat = store.getState().userReducer.selectedChat;
      // const allChats = store.getState().userReducer.allChats;

      if (selectedChat?._id === data.chatId) {
        const updatedChats = allChats.map((chat) =>
          chat._id === data.chatId ? { ...chat, unreadMessageCount: 0 } : chat
        );
        dispatch(setAllMessages(updatedChats));

        setAllMessage((prevMessage) =>
          prevMessage.map((msg) => ({ ...msg, read: true }))
        );
      }
    }

    const handleTyping = (data) => {
      if (selectedChat._id === data.chatId && data.sender !== user._id) {
        setIsTyping(true);
        setTypingData(data);
        setTimeout(() => {
          setIsTyping(false);
        }, 1000);
      }
    }

    socket.on("receive-message", handleReceiveMessage);

    socket.on("message-count-cleared", handleMessageCountCleared);

    socket.on("started-typing", handleTyping);

    return () => {
      socket.off("receive-message");
      socket.off("message-count-cleared");
      socket.off("started-typing");
    };
  }, [selectedChat, isTyping, isEmoji]);

  useEffect(() => {
    const mainChatAreaContainer = document.getElementById("main-chat-area");
    if (mainChatAreaContainer) {
      mainChatAreaContainer.scrollTop = mainChatAreaContainer.scrollHeight;
    }
  }, [allMessage]);

  const sendMessage = async (image) => {
    if(isEmoji){
      setIsEmoji(!isEmoji);
    }
    try {
      if (!message && !image) {
        // toast.error("Please enter a message or select an image");
        return;
      }
      console.log(selectedChat.encryptedKey, "encrypt key", "message", message)
      const {encryptedMessage, iv} = await encryptMessage(message, selectedChat.encryptedKey)
      console.log(encryptedMessage, 'encrypted message');
      
      const messageBody = {
        chatId: selectedChat._id,
        sender: user._id,
        text: JSON.stringify({encryptedMessage, iv}),
        image: image,
      };

      socket.emit("send-message", {
        ...messageBody,
        members: selectedChat?.members.map((el) => el._id),
        read: false,
        createdAt: moment().format("DD-MM-YYYY HH:mm:ss"),
      });


      await createNewMessage(messageBody);
      setMessage("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const clearUnreadMessage = async () => {
    try {
      socket.emit("clear-unread-message", {
        chatId: selectedChat._id,
        members: selectedChat?.members.map((el) => el._id),
      });

      const [response, status_code] = await clearUnreadMessageCount(selectedChat._id);
      if (status_code === 200) {
        const updatedChats = allChats.map((chat) =>
          chat._id === selectedChat._id ? response.data : chat
        );
        dispatch(setAllMessages(updatedChats));
      } else {
        toast.error("Error clearing unread messages");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const toggleIconElement = () => {
    setIsEmoji(!isEmoji);
  };

  const sendImage = async (e) => {
    if(isEmoji){
      setIsEmoji(!isEmoji);
    }
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      sendMessage(reader.result);
    };
  };

  const toggleMenuElement = async (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearChat = async () => {
    console.log("Clear Chat Clicked");
    handleClose();
  };

  const handleBlockChat = () => {
    console.log("Block Chat Clicked");
    handleClose();
  };

  return (
    <>
      {selectedChat && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "90dvh",
            width: "90%",
            marginLeft: "10px",
            overflow: "hidden",
          }}
        >
          {/* Chat Header */}
          <Box sx={{ p: 2, borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "space-between" , width: "100%"}}>
            <Box sx={{display: "flex", alignItems: "center", gap: "12px"}}>
              <IconButton onClick={()=> dispatch(setSelectedChat(null))}>
              <ArrowBackIcon sx={{ color: "var(--text-color)" }} />
              </IconButton>
              <Avatar src={selectedUser.profilePic}>{selectedUser.firstName[0]}</Avatar>
              <Typography variant="h6" style={{color: "var(--text-color)"}}>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </Typography>
            </Box>

            <IconButton onClick={toggleMenuElement} style={{color: 'var(--text-color)'}}>
              <MoreVertIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{right:'1rem', margin: 0, padding: 0}}>
             <Box style={{backgroundColor: "var(--primary-color)", color: "var(--text-color)"}}>
             <MenuItem onClick={handleClearChat}>Clear Chat</MenuItem>
             <MenuItem onClick={handleBlockChat}>Block Chat</MenuItem>
             <MenuItem onClick={handleBlockChat}>Exit Chat</MenuItem>
             </Box>
            </Menu>

          </Box>

          {/* Chat Messages */}
          <Box
            id="main-chat-area"
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <List>
              {isLoading ? (
                Array.from(new Array(6)).map((_, index) =>(
                  <ListItem key={index} sx={{ justifyContent: index % 2 === 0 ? "flex-start" : "flex-end" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: index % 2 === 0 ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {/* <Skeleton variant="rounded" width="100%" height={40} sx={{bgcolor: "rgba(0,0,0,0.1)", borderRadius: '10px'}} /> */}

                      <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />

                    </Box>
                  </ListItem>  
                ))):
              
              allMessage.map((message, index) => {
                const isCurrentUserSender = message.sender === user._id;
                return (
                  <ListItem
                    key={message._id || `temp-${index}`}
                    sx={{
                      justifyContent: isCurrentUserSender ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isCurrentUserSender ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: isCurrentUserSender ? "var(--secondary-color);" : "#f5f5f5",
                          color: isCurrentUserSender ? "#fff" : "#000",
                          borderRadius: "10px",
                          p: 1.5,

                          maxWidth: "80%",
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {message.text}
                        {message.image && (
                          <img src={message.image} alt="image" height="120" width="120" />
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ mt: 0.5 }}>
                        {formatTime(message.timestamp)}
                        {isCurrentUserSender && message.read && (
                          <Badge color="success" badgeContent="✓" sx={{ ml: 1 }} />
                        )}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
            {isTyping && (
              <Typography variant="caption" sx={{ ml: 2 }}>
                Typing...
              </Typography>
            )}
          </Box>

          {/* Emoji Picker */}
          {isEmoji && (
            // <Box sx={{ display: "flex", justifyContent: "flex-start",  position: 'absolute',zIndex: 1000,  }}>
            //   <EmojiPicker
            //     onEmojiClick={(emoji) => setMessage(message + emoji.emoji)}
            //   />
            // </Box>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  bottom: "10px", // Adjusts the placement above the text field
                  left: "10px", // Aligns it properly
                  zIndex: 1000,
                  background: "var(--text-color)",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                }}
              >
                <EmojiPicker onEmojiClick={(emoji) => setMessage(message + emoji.emoji)} />
              </Box>
            </Box>
          )}

          {/* Message Input Area */}
          <Box sx={{ p: 2, borderTop: "1px solid #ddd",  }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={toggleIconElement}>
                <EmojiIcon />
              </IconButton>
              <TextField style={{color: "var(--text-color)"}}
                fullWidth
                placeholder="Type a message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  socket.emit("user-typing", {
                    chatId: selectedChat._id,
                    members: selectedChat.members.map((mem) => mem._id),
                    sender: user._id,
                  });
                }}
                onKeyDown={handleKeyDown}
              />
              <IconButton component="label">
                <ImageIcon />
                <input
                  type="file"
                  id="send-image-input"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={sendImage}
                />
              </IconButton>
              <IconButton onClick={() => sendMessage("")}>
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

ChatArea.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default ChatArea;