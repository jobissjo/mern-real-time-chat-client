import { axiosInstance } from "./index";

export const getAllChats = async ()=> {
    try {
        const response = await axiosInstance.get("/api/chat/get-all-chats");
        return [response.data, response.status]; 
    }catch (error) {
        return [error.response.data, error.status];
    }
}

export const createNewChat = async (members)=> {
    try {
        const response = await axiosInstance.post("/api/chat/create-new-chat", {members});
        return [response.data, response.status]; 
    }catch{
        return [error.response.data, error.status];
    }
}

export const clearUnreadMessageCount = async (chatId)=> {
    try {
        const response = await axiosInstance.post("/api/chat/clear-unread-message", {chatId});
        return [response.data, response.status]; 
    }catch (error) {
        return [error.response.data, error.status];
    }
}

export const getChatMessage = async (chatId)=> {
    
    return await axiosInstance.get(`/api/chat/get-all-chats/${chatId}`);
    
}