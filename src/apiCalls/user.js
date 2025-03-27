import { axiosInstance } from "."

const getLoggedUser = async ()=> {
    try {
        const response = await axiosInstance.get("/api/user/get-logged-user");
        return [response.data, response.status]; 
    }catch (error) {
        return [error.response.data, error.status];
    }
}

const getAllUsers = async ()=> {
    try {
        const response = await axiosInstance.get("/api/user/get-all-users");
         console.log(response, 'get all users');
                
        return [response.data, response.status];
    }catch (error) {
        return error;
    }
}

const updateProfilePicture = async (image)=> {
    try {
        const response = await axiosInstance.put("/api/user/update-profile-pic", {profilePic:image});
        return [response.data, response.status]; 
    }catch (error) {
        return [error.response.data, error.status];
    }
}


const getFriendsList = async ()=> {
    return await axiosInstance.get("/api/user/get-friends-list");
}

const getNotChattedFriendsList = async ()=> {
    return await axiosInstance.get("/api/user/not-chatted-friends");
}

const getGlobalSearchFriendsList = async (searchKey)=> {
    return await axiosInstance.get(`/api/user/search-global-users`, {
        params: {searchKey}        
    });
}
export  {getLoggedUser, getAllUsers, updateProfilePicture, getFriendsList, getNotChattedFriendsList, getGlobalSearchFriendsList};