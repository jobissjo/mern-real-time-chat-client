import React, { useState, useEffect } from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import { clearAllNotificationOfUser, getAllNotification, deleteAllNotificationsOfUser, readNotification } from '../../apiCalls/notification';
import toast from 'react-hot-toast';
import {
    Box, Typography, Button, List, ListItem, Paper, Skeleton
} from "@mui/material";

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getAllNotification();
            if (response.status === 200) {
                setNotifications(response.data?.data);
            } else {
                toast.error(response.error.message);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await readNotification(id);
            if (response.status === 200) {
                toast.success(response.data?.message ?? 'Notification marked as read');
                fetchNotifications();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await clearAllNotificationOfUser();
            if (response.status === 200) {
                toast.success(response.data?.message ?? 'All notifications marked as read');
                fetchNotifications();
            } else {
                toast.error(response.error.message);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteAllNotifications = async () => {
        try {
            const response = await deleteAllNotificationsOfUser();
            if (response.status === 200) {
                toast.success(response.data?.message ?? 'All notifications cleared');
                fetchNotifications();
            } else {
                toast.error(response.error.message);
            }
        } catch (error) {
            console.error('Error deleting all notifications:', error);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
            <ProfileHeader />
            <Box sx={{ display: "flex", flex: 1 }}>
                <ProfileSidebar />
                <Box sx={{ flex: 1, p: 3 }}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3
                    }}>
                        <Typography variant="h5">Notifications</Typography>
                        <Box>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ mr: 2 }}
                                onClick={deleteAllNotifications}
                                disabled={loading}
                            >
                                Clear All
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={markAllAsRead}
                                disabled={loading}
                            >
                                Mark All as Read
                            </Button>
                        </Box>
                    </Box>

                    {/* Skeleton Loader when loading */}
                    {loading ? (
                        <List>
                            {[1, 2, 3, 4].map((index) => (
                                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                                    <Skeleton variant="text" width="60%" height={20} />
                                    <Skeleton variant="text" width="40%" height={20} />
                                </Paper>
                            ))}
                        </List>
                    ) : (
                        <List>
                            {notifications.map(notification => (
                                <Paper key={notification._id} sx={{
                                    p: 2, mb: 2,
                                    backgroundColor: notification.read ? "white" : "#f0f4ff",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <Typography variant="body1">{notification.message}</Typography>
                                    {!notification.read && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => markAsRead(notification._id)}
                                        >
                                            Mark as Read
                                        </Button>
                                    )}
                                </Paper>
                            ))}
                        </List>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default NotificationList;
