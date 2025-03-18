import React, { useEffect, useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import './profile.css';
import { acceptFriendRequest, getAllFriendRequests, rejectUserFriendRequest } from '../../apiCalls/friendRequest';
import { getFriendsList } from '../../apiCalls/user';
import toast from 'react-hot-toast';

import {
    Box, Button, List,
    ListItem, Avatar, Typography, Paper, Badge
} from "@mui/material";
import Skeleton from '@mui/material/Skeleton';


const FriendList = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getFriendRequests = async () => {
        try {
            const response = await getAllFriendRequests();
            if (response.status === 200) {
                setFriendRequests(response?.data?.data);
            }
            else {
                toast.error(response.error.message)
            }
        }
        catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    }

    const getFriendsListOfUser = async () => {
        try {
            const response = await getFriendsList();
            if (response.status === 200) {
                console.log(response.data, 'response data');

                setFriends(response?.data?.data);
            }
            else {
                toast.error(response?.error?.message ?? 'Error fetching friends')
            }
        }
        catch (error) {
            console.error('Error fetching friends list:', error);
        }
    }

    const acceptFriendRequestOfUser = async (requestId) => {
        try {
            const request = await acceptFriendRequest(requestId);
            if (request.status === 200) {
                toast.success(request.data?.message);
                getFriendRequests();
                getFriendsListOfUser();
            }
        }
        catch (error) {
            toast.error(error.response?.data?.message ?? 'Error accepting friends request');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all(
                [getFriendRequests(),
                getFriendsListOfUser(),]
            )
            setIsLoading(false);
        }
        fetchData();

    }, [])


    const rejectFriendRequest = async (requestId) => {
        try {
            const response = await rejectUserFriendRequest(requestId);
            if (response.status === 200) {
                toast.success(response.data?.message);
                getFriendRequests();
                getFriendsListOfUser();
            }
        } catch (error) {
            toast.error(error?.message ?? 'Error accepting friend request');
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100dvh", background: 'var(--primary-color)' }}>
            <ProfileHeader />
            <Box sx={{ display: "flex", flex: 1 }}>
                <ProfileSidebar />
                <Box sx={{ flex: 1, p: 3 }}>
                    {/* Friend Requests Section */}
                    <Typography variant="h5" gutterBottom sx={{color: 'var(--text-color)'}} >
                        Friend Requests
                    </Typography>
                    {isLoading ? (<div>
                        <List>
                            {[1, 2].map((_, index) => (
                                <Paper key={index} sx={{ p: 2, mb: 2,  background: 'var(--card-color)' }}>
                                    <ListItem sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Skeleton variant="circular" width={40} height={40} />
                                        <Skeleton variant="rectangle" width={60} height={20} />

                                    </Box>
                                    
                                    <Box sx={{display: 'flex', alignItems: "center", gap: 2}}>
                                        <Skeleton variant="rectangle" width={60} height={30} />
                                        <Skeleton variant="rectangle" width={60} height={30} />
                                    </Box>

                                </ListItem>
                                </Paper>
                            ))}
                        </List>
                    </div>
                    ) : friendRequests.length > 0 ? (
                        <List>
                            {friendRequests.map((friend) => (
                                <Paper key={friend._id} sx={{ p: 2, mb: 2, background: 'var(--card-color)' }}>
                                    <ListItem
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar>{friend?.fromUser?.firstName}</Avatar>
                                            <Typography variant="body1">{friend?.fromUser.firstName}</Typography>
                                        </Box>
                                        <Box>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                sx={{ mr: 1 }}
                                                onClick={() => acceptFriendRequestOfUser(friend._id)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => rejectFriendRequest(friend._id)}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    </ListItem>
                                </Paper>
                            ))}
                        </List>
                    ) : (
                        <Typography sx={{color: 'var(--text-color)'}} >No new friend requests.</Typography>
                    )}

                    {/* Friends List Section */}
                    <Typography sx={{color: 'var(--text-color)'}} variant="h5" gutterBottom>
                        Friends List
                    </Typography>
                    {isLoading ? (<div>
                        <List>
                            {[1, 2].map((_, index) => (
                                <ListItem sx={{ background: 'var(--card-color)'}}>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                        badgeContent={
                                            <Skeleton
                                                variant="circular"
                                                width={12}
                                                height={12}
                                                sx={{ border: "2px solid white" }}
                                            />
                                        }
                                    >
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </Badge>
                                    <Box sx={{ ml: 2, flex: 1 }}>
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="60%" />
                                    </Box>

                                </ListItem>
                            ))}
                        </List>
                    </div>
                    ) : (
                        friends.length > 0 ? (
                            <List>
                                {friends.map((friend) => (
                                    <Paper key={friend._id} sx={{ p: 2, mb: 2, background: 'var(--card-color)' }}>
                                        <ListItem >
                                            {/* Active status dot */}
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                badgeContent={
                                                    <Box
                                                        sx={{
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: "50%",
                                                            backgroundColor: friend?.isOnline ? "green" : "gray",
                                                            border: "2px solid white",
                                                        }}
                                                    />
                                                }
                                            >
                                                <Avatar
                                                    src={friend?.profilePic}
                                                    sx={{ width: 40, height: 40, mr: 2 }}
                                                >
                                                    {!friend?.profilePic && friend?.firstName?.charAt(0)}
                                                </Avatar>
                                            </Badge>
                                            <Typography variant="body1">{friend?.firstName}</Typography>
                                        </ListItem>
                                    </Paper>
                                ))}
                            </List>
                        ) : (
                            <Typography>No friends yet.</Typography>
                        )
                    )}

                </Box>
            </Box>
        </Box>
    );
};

export default FriendList;
