import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import Search from './search';
import UserList from './UserList';

const Sidebar = ({ socket, onlineUsers }) => {
    const [searchKey, setSearchKey] = useState('');

    return (
        <Box sx={{ width: 400, p: 1 }} >
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3, backgroundColor: 'var(--primary-color);' }}>
                <Search searchKey={searchKey} setSearchKey={setSearchKey} />
                <UserList searchKey={searchKey} socket={socket} onlineUsers={onlineUsers} />
            </Paper>
        </Box>
    );
};

export default Sidebar;
