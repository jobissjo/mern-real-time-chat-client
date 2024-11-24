import { useEffect } from "react";
import  {useNavigate} from "react-router-dom"
import { getLoggedUser, getAllUsers } from "../apiCalls/user";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setUser, setAllUsers, setAllChats } from "../redux/userSlice";
import { getAllChats } from "../apiCalls/chat";

function ProtectedRoute({children}){
    const { user } = useSelector(state => state.userReducer)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const getLoggedInUser = async () => {
        try {
            dispatch(showLoader());
            const [response, status_code] = await getLoggedUser();
            dispatch(hideLoader());
            if (status_code === 200){
                dispatch(setUser(response.data));
                
            }
            else{ 
                navigate('/login');
            }
        }catch (err) {
            navigate('/login');
        }
    }

    const getAllUsersOfUser = async (user) => {
        try {
            dispatch(showLoader());
            const [response, status_code] = await getAllUsers();
            dispatch(hideLoader());
            if (status_code === 200){
                // handle data
                console.log('dsffff', response.data);
                
                dispatch(setAllUsers(response.data));
            }
            else{
                console.warn("something went wrong")
            }
        } catch (err) {
            console.warn("error occurred")
        }
    }

    const getCurrentUserAllChats = async () => {
        try {
            const [response, status_code] = await getAllChats(user);
            if (status_code === 200){
                dispatch(setAllChats(response.data));
            }
            console.log(response.data);
            
        }
        catch (err) {
            console.warn("error occurred" + err.message )
        }
    }


    useEffect(()=> {
        if (localStorage.getItem('token')){
            getLoggedInUser();
            getAllUsersOfUser();
            getCurrentUserAllChats();
        }
        else{
            navigate('/login');
        }
    }, [])
    return (<div>
        { children }
    </div>)
}

export default ProtectedRoute;