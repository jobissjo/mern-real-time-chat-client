import { axiosInstance } from ".";

const getUserPreferences = async ()=> {
    return await axiosInstance.get("/api/preferences/");
}

const updateUserPreferences = async (preferences)=> {
    return await axiosInstance.put("/api/preferences/", preferences);
}

export {getUserPreferences, updateUserPreferences};