import { axiosInstance } from "./index";

export const sendFriendRequest = async (receiverId)=> {
    return await axiosInstance.post("/api/friend/send-friend-request", {receiverId});
}

export const acceptFriendRequest = async (requestId)=> {
    return await axiosInstance.put("/api/friend/accept-friend-request", {requestId});
}

export const rejectFriendRequest = async (senderId)=> {
    return await axiosInstance.post("/api/friend/reject-friend-request", {senderId});
}

export const getAllFriendRequests = async ()=> {
    return await axiosInstance.get("/api/friend/get-friend-requests");
}

export const cancelFriendRequest = async (requestId)=> {
    return await axiosInstance.delete(`/api/friend/cancel-friend-request/${requestId}`);
}