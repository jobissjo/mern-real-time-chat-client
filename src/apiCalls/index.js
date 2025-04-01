import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.API_URL ?? 'https://mern-real-time-chat-1.onrender.com'
})

axiosInstance.interceptors.request.use(
    async config => {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        return config;
    },
    error => {
        Promise.reject(error);
    }
)

export {axiosInstance};