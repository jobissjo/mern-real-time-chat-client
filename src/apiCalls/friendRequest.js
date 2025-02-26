import { axiosInstance } from "./index";

export const sendFriendRequest = async (receiverId)=> {
    return await axiosInstance.post("/api/friend/send-friend-request", {receiverId});
}