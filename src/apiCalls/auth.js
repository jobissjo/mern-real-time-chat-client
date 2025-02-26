import { axiosInstance } from "./index";

export const signupUser = async (user) => {
    try {
        const response = await axiosInstance.post("/api/auth/signup", user);
        console.log(response);
        
        return [response.data, response.status];
    } catch (error) {
        console.log(error);
        
        return [error.message, error.status];
    }
}

export const verifyAccount = async (email) => {
    try {
        const response = await axiosInstance.post("/api/auth/verify-email", { email });
        
        return [response.data, response.status];
    } catch (error) {
      
        return [error.response?.data, error.status];
    }
}

export const loginUser = async (user) => {
    try {
        const response = await axiosInstance.post("/api/auth/login", user)
        if (response.status === 200 && response.data.token !== undefined) {
            localStorage.setItem("token", response.data.token)
        }        
        return [response.data, response.status];
    }
    catch (error) {

        return [error.response?.data, error.status];
    }
}