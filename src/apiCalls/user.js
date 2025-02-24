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

export  {getLoggedUser, getAllUsers, updateProfilePicture};