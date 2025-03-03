import React, { useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import './profile.css';

const initialNotifications = [
    { id: 1, text: 'You have a new friend request.', read: false },
    { id: 2, text: 'Your profile picture was updated successfully.', read: true },
    { id: 3, text: 'Someone liked your post.', read: false },
    { id: 4, text: 'A new message from Jane.', read: false }
];

const NotificationList = () => {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    return (
        <div className="notifications-container">
            <ProfileHeader />
            <div className="notifications-layout">
                <ProfileSidebar />
                <div className="notifications-content">
                    <div className="notification-header">
                        <h2>Notifications</h2>
                        <button className="mark-all-btn" onClick={markAllAsRead}>Mark All as Read</button>
                    </div>
                    <ul className="profile-notification-list">
                        {notifications.map(notification => (
                            <li key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                                <span className="notification-text">{notification.text}</span>
                                {!notification.read && (
                                    <button className="mark-read-btn" onClick={() => markAsRead(notification.id)}>Mark as Read</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NotificationList;
