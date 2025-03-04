import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = () => {
    const navigate = useNavigate();

    const logout = async ()=> {
        localStorage.removeItem('token');
        navigate('/login');
        socket.emit('user-logout', user._id);
        dispatch(logoutUser());
    }

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
            <div className='profile-card' onClick={() => navigate('/security')}>
                <i className='fa fa-shield'></i>
                <span>Security</span>
            </div>
            <div className='profile-card' onClick={() => logout()}>
                <i className='fa fa-power-off'></i>
                <span>Logout</span>

            </div>
        </div>
    );
};

export default ProfileSidebar;
