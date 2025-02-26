import { axiosInstance } from ".";

export const getAllNotification = async ()=> {
    return await axiosInstance.get("/api/notification/get-all-notifications");
}

export const readNotification = async (notificationId)=> {
    return await axiosInstance.put(`/api/notification/read-notification/${notificationId}`);
}

export const clearAllNotificationOfUser = async ()=> {
    return await axiosInstance.put("/api/notification/clear-all-notifications");
}