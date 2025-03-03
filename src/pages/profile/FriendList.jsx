import React from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import './profile.css';

const friends = [
    { id: 1, name: 'John Doe', status: 'Online' },
    { id: 2, name: 'Jane Smith', status: 'Offline' },
    { id: 3, name: 'David Brown', status: 'Online' },
    { id: 4, name: 'Emily White', status: 'Offline' }
];

const FriendList = () => {
    return (
        <div className="friends-container">
            <ProfileHeader />
            <div className="friends-layout">
                <ProfileSidebar />
                <div className="friends-content">
                    <h2>Friends List</h2>
                    <ul className="friend-list">
                        {friends.map(friend => (
                            <li key={friend.id} className="friend-item">
                                <i className="fa fa-user-circle friend-icon"></i>
                                <div className="friend-info">
                                    <span className="friend-name">{friend.name}</span>
                                    <span className={`friend-status ${friend.status.toLowerCase()}`}>
                                        {friend.status}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FriendList;
