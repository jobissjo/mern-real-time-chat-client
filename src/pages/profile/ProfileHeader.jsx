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

const ProfileHeader = () => {

    const navigate = useNavigate()
    const [darkMode, setDarkMode] = useState(false)

    const logOut = async () => {
        localStorage.removeItem('token')
        navigate('/login');
        // socket.emit('user-logout', user._id)

    }
    const getPreferences = async () => {
        try{
            let response = await getUserPreferences();
            if (response.status === 200){
                console.log(response.data?.data?.isDarkMode, 'sssssssssssssssssssssssssss')
                setDarkMode(response.data?.data?.isDarkMode);
            }
            else {
                toast.error("Failed to fetch user preferences.")
            }
        }catch(e){
            toast.error("Failed to fetch user preferences. Please try again later.")
        }
    }
    useEffect( ()=> {
        getPreferences()
    })
    const updatePreference = async () => {
        try {
            let response = await updateUserPreferences({ isDarkMode: !darkMode });
            if (response.status === 200) {
                toast.success("Dark Mode preference updated successfully.");
                getPreferences()
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
                backgroundColor: darkMode ? "#121212" : "#ff5b5b ",
                boxShadow: "none",
                color: darkMode ? "#ffffff" : "#28282b",
            }}
        >
            <Toolbar>
                {/* App Logo and Title */}
                <Box
                    sx={{ display: "flex", alignItems: "center", flexGrow: 1, cursor: "pointer" }}
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
                            <Switch checked={darkMode} onChange={updatePreference} color="default" />
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