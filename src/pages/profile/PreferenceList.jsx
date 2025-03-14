import React, { useEffect, useState } from "react";
import { Container, Typography, Switch, FormControlLabel, Select, MenuItem, Button, Paper, Box } from "@mui/material";
import ProfileSidebar from "./ProfileSidebar";
import ProfileHeader from "./ProfileHeader";
import "./profile.css";
import { getUserPreferences, updateUserPreferences } from "../../apiCalls/preference";
import toast from "react-hot-toast";

const PreferenceList = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNotification, setIsNotification] = useState(true);
    const [language, setLanguage] = useState("en");
    const [isLastSeen, setIsLastSeen] = useState(true);

    const fetchUserPreference = async () => {
        try {
            const response = await getUserPreferences();
            if (response.status === 200) {
                toast.success(response.data?.message);
                setIsDarkMode(response.data.data?.isDarkMode ?? false);
                setIsNotification(response.data.data?.isNotification ?? true);
                setLanguage(response.data.data?.language);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const updatePreferences = async (updatedData) => {
        try {
            const response = await updateUserPreferences(updatedData);
            if (response.status === 200) {
                toast.success(response.data?.message);
                fetchUserPreference();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchUserPreference();
    }, []);

    return (
        <Box>
            <ProfileHeader />
            <Box display="flex" >
                <ProfileSidebar />
                <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        Preferences
                    </Typography>

                    <FormControlLabel
                        control={<Switch checked={isDarkMode} onChange={() => updatePreferences({ isDarkMode: !isDarkMode })} />}
                        label="Dark Mode"
                    />

                    <FormControlLabel
                        control={<Switch checked={isNotification} onChange={() => setIsNotification((prev) => !prev)} />}
                        label="Notifications"
                    />

                    <Box mt={2}>
                        <Typography variant="body1">Language</Typography>
                        <Select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="sp">Spanish</MenuItem>
                            <MenuItem value="fr">French</MenuItem>
                            <MenuItem value="gr">German</MenuItem>
                        </Select>
                    </Box>

                    <FormControlLabel
                        control={<Switch checked={isLastSeen} onChange={() => setIsLastSeen((prevVal) => !prevVal)} />}
                        label="Show Last Seen"
                    />
                    <Typography variant="caption" color="error">
                        If you turn this off, you won't be able to see others' last seen.
                    </Typography>

                    <Box mt={2}>
                        <Button variant="outlined" color="error" fullWidth onClick={() => console.log("Need to redirect")}> 
                            Manage Blocked Users
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default PreferenceList;