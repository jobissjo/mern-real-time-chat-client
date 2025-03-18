import { useNavigate } from "react-router-dom";
import {
    AppBar, Toolbar, Typography,
    IconButton, Box,
    Switch, FormControlLabel,
} from "@mui/material";
import { Chat as ChatIcon, PowerSettingsNew as LogoutIcon, Brightness4 as DarkModeIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getUserPreferences, updateUserPreferences } from "../../apiCalls/preference";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setPreference } from "../../redux/userSlice";

const ProfileHeader = () => {
    const {preference} = useSelector(state => state.userReducer);
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const logOut = async () => {
        localStorage.removeItem('token')
        navigate('/login');
        // socket.emit('user-logout', user._id)

    }
    
    useEffect( ()=> {
        if (preference?.isDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('root');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('root');
        }
    }, [preference?.isDarkMode])
    const updatePreference = async () => {
        try {
            let response = await updateUserPreferences({ isDarkMode: !preference?.isDarkMode });
            if (response.status === 200) {
                toast.success("Dark Mode preference updated successfully.");
                const preferenceResponse =await getUserPreferences()
                dispatch(setPreference(preferenceResponse?.data.data));
            }
            else {
                toast.error("Failed to update dark mode preference.")
            }
        }catch (e) {
            toast.error("Failed to update preference. Please try again later.")
        }
    }
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "var(--secondary-color)",
                boxShadow: "none",
                color: "var(--text-color)",
            }}
        >
            <Toolbar>
                {/* App Logo and Title */}
                <Box
                    sx={{ display: "flex", alignItems: "center", flexGrow: 1, cursor: "pointer", marginLeft: "1rem" }}
                    onClick={() => navigate("/")}
                >
                    <IconButton color="inherit">
                        <ChatIcon sx={{ fontSize: "28px" }} />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Quick Chat
                    </Typography>
                </Box>

                {/* Dark Mode Toggle */}
                <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    <DarkModeIcon sx={{ mr: 1 }} />
                    <FormControlLabel
                        control={
                            <Switch checked={preference?.isDarkMode} onChange={updatePreference} color="default" />
                        }
                    // label="Dark Mode"
                    />
                </Box>

                {/* Logout Button */}
                <IconButton color="inherit" onClick={logOut}>
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};


export default ProfileHeader;