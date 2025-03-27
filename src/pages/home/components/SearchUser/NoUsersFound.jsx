// Custom Illustration
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PersonOffIcon from "@mui/icons-material/PersonOff";

const NoUsersFound = () => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" height="250px">
            <img src={"/images/no-users.jpg"} alt="No Users Found" style={{ width: "200px", marginBottom: "10px" }} />
            <Typography variant="h6" color="var(--text-color)">
                No users found
            </Typography>
            <Typography variant="body2" color="var(--text-color)">
                Try refining your search criteria.
            </Typography>
        </Box>
    );
};

export default NoUsersFound;
