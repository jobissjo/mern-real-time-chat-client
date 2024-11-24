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

export  {getLoggedUser, getAllUsers};