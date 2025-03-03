import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="profile-sidebar">
            <div className="profile-card" onClick={() => navigate('/profile')}>
                <i className="fa fa-user" aria-hidden="true"></i>
                <span>Profile</span>
            </div>
            <div className="profile-card" onClick={() => navigate('/friends')}>
                <i className="fa fa-users"></i>
                <span>Friends</span>
            </div>
            <div className="profile-card" onClick={() => navigate('/notifications')}>
                <i className="fa fa-bell"></i>
                <span>Notifications</span>
            </div>
            <div className="profile-card" onClick={() => navigate('/preferences')}>
                <i className="fa fa-cog"></i>
                <span>Preferences</span>
            </div>
        </div>
    );
};

export default ProfileSidebar;
