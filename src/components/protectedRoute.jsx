import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom"
import { getLoggedUser, getAllUsers } from "../apiCalls/user";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setAllUsers, setAllChats, setPreference } from "../redux/userSlice";
import { getAllChats } from "../apiCalls/chat";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getUserPreferences } from '../apiCalls/preference';

function ProtectedRoute({ children }) {
    const { user, preference } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)

    const getLoggedInUser = async () => {
        try {
            const [response, status_code] = await getLoggedUser();
            if (status_code === 200) {
                dispatch(setUser(response.data));

            }
            else {
                navigate('/login');
            }
        } catch (err) {
            navigate('/login');
        }
    }

    const getAllUsersOfUser = async () => {
        try {

            const [response, status_code] = await getAllUsers();
            setIsLoading(false)
            if (status_code === 200) {
                // handle data

                dispatch(setAllUsers(response.data));
            }
            else {
                console.warn("something went wrong")
            }
        } catch (err) {
            setIsLoading(false)
            console.warn("error occurred", err)
        }
    }

    const fetchUserPreference = async () => {

        try {
            let response = await getUserPreferences()
            if (response.status === 200) {
                
                dispatch(setPreference(response.data.data))
            }
            else {
            }
        } catch (error) {
            setIsLoading(false)
            console.error('Error fetching preferences:', error);
        }

    }



    const getCurrentUserAllChats = async () => {
        try {
            const [response, status_code] = await getAllChats();
            if (status_code === 200) {
                dispatch(setAllChats(response.data));
            }
            console.log(response.data);

        }
        catch (err) {
            setIsLoading(false)
            console.warn("error occurred" + err.message)
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            if (localStorage.getItem('token')) {
                setIsLoading(true);
                await Promise.all([
                    getLoggedInUser(),
                    getAllUsersOfUser(),
                    getCurrentUserAllChats(),
                    fetchUserPreference()
                ]);
                setIsLoading(false);
            } else {
                setIsLoading(false);
                navigate('/login');
            }
        };

        if(preference?.isDarkMode){
            document.body.classList.add('dark-mode');
        }else{
            document.body.classList.remove('root');
        }

        fetchData();
    }, [])
    return (<div>
        {!isLoading && user?._id && children}
        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100dvw', height: '100dvh' }}>
            <CircularProgress />
        </Box>}
    </div>)
}
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
