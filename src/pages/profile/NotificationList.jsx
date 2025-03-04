import React, { useState, useEffect } from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap for Skeleton styles
import { clearAllNotificationOfUser, getAllNotification, deleteAllNotificationsOfUser, readNotification } from '../../apiCalls/notification';
import toast from 'react-hot-toast/headless';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {

        
        fetchNotifications();
        
    }, []);

    const fetchNotifications = async () => {
        try {
            // Simulating an API request (replace with real API call)
            const response = await getAllNotification();
            if (response.status === 200){
                console.log(response.data?.data, "notification");
                setNotifications(response.data?.data);
            }
            else{
                toast.error(response.error.message)
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false); // Stop loading when data is fetched
        }
    };

    const markAsRead = async (id) => {
        try{
            let response = await readNotification(id);
            if(response.status === 200){
                toast.success(response.data?.message?? 'Notification marked as read');
                fetchNotifications();
            }
        }
        catch(error){
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try{
            let response = await clearAllNotificationOfUser();
            if(response.status === 200){
                toast.success(response.data?.message ?? 'All notifications marked as read');
                fetchNotifications();
            }
            else{
                toast.error(response.error.message)
            }
        }
        catch(error){
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteAllNotificationOfUser = async () => { 
        try{
            const response = await deleteAllNotificationsOfUser();
            if(response.status === 200){
                toast.success(response.data?.message ?? 'All notifications cleared');
                fetchNotifications()
            }
            else{
                toast.error(response.error.message)
            }
        }
        catch(error){
            console.error('Error deleting all notifications:', error);
        }
    }

    

    return (
        <div className="notifications-container">
            <ProfileHeader />
            <div className="notifications-layout">
                <ProfileSidebar />
                <div className="notifications-content">
                    <div className="notification-header">
                        <h2>Notifications</h2>
                        <div>
                            <button className="clear-all-btn-pr-msg" onClick={deleteAllNotificationOfUser} disabled={loading}>
                                Clear All
                            </button>
                            <button className="mark-all-btn" onClick={markAllAsRead} disabled={loading}>
                                Mark All as Read
                            </button>
                        </div>
                    </div>

                    {/* Show Skeleton Loader when loading */}
                    {loading ? (
                        <ul className="profile-notification-list">
                            {[1, 2, 3, 4].map((index) => (
                                <li key={index} className="notification-item">
                                    <div className="placeholder-glow">
                                        <span className="placeholder col-8"></span>
                                        <span className="placeholder col-4"></span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className="profile-notification-list">
                            {notifications.map(notification => (
                                <li key={notification._id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                                    <span className="notification-text">{notification.message}</span>
                                    {!notification.read && (
                                        <button className="mark-read-btn" onClick={() => markAsRead(notification._id)}>
                                            Mark as Read
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationList;
