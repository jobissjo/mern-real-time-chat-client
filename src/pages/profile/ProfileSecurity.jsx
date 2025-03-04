import React, { useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import './profile.css'; // ✅ Shared styles
import { changeCurrentPassword } from '../../apiCalls/auth';
import toast from 'react-hot-toast';

const ProfileSecurity = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const handlePasswordUpdate = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try{
            const response = await changeCurrentPassword({newPassword, oldPassword: currentPassword});
            if (response.status === 200) {
                toast.success('Password updated successfully');

            }else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    };

    return (
        <div className="security-container">
            <ProfileHeader />
            <div className="security-layout">
                <ProfileSidebar />
                <div className="security-content">
                    <h2>Profile Security</h2>

                    {/* Password Management */}
                    <div className="security-section">
                        <h3>Password Management</h3>
                        <input 
                            type="password" 
                            placeholder="Current Password" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input 
                            type="password" 
                            placeholder="New Password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm New Password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button className="update-btn" onClick={handlePasswordUpdate}>
                            Update Password
                        </button>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="security-section">
                        <h3>Two-Factor Authentication</h3>
                        <button 
                            className={`toggle-btn ${twoFactorEnabled ? 'enabled' : 'disabled'}`} 
                            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        >
                            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurity;
