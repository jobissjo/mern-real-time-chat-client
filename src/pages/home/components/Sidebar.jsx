import React, { useState } from 'react';
import { Box, Paper, useMediaQuery } from '@mui/material';
import Search from './search';
import UserList from './UserList';

const Sidebar = ({ socket, onlineUsers }) => {
    const [searchKey, setSearchKey] = useState('');
    const isMediaQuery = useMediaQuery("(max-width: 768px)");

    console.log('isMediaQuery', isMediaQuery);
    

    return (
        <Box sx={{ width: isMediaQuery ? "100dvw":  500, p: 1, height: '100dvh' }} >
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3, backgroundColor: 'var(--primary-color);' }}>
                <Search searchKey={searchKey} setSearchKey={setSearchKey} />
                <UserList searchKey={searchKey} socket={socket} onlineUsers={onlineUsers} />
            </Paper>
        </Box>
    );
};

export default Sidebar;
