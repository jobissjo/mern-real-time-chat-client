import { axiosInstance } from ".";

const createNewMessage = async (message) => {
    try {
        const response = await axiosInstance.post("api/message/send-message", message);
        return [response.data, response.status];
    } catch (error) {
        return [error.response.data, error.status];
    }
}

const getAllMessages = async (chatId) => {
    try {
        const response = await axiosInstance.get(`/api/message/get-all-messages/${chatId}`);
        return [response.data, response.status];
    }
    catch (error) {
        return [error.response.data, error.status];
    }
}

export { createNewMessage, getAllMessages }