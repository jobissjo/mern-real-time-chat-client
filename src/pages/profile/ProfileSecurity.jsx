import React, { useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import './profile.css'; // ✅ Shared styles
import { changeCurrentPassword } from '../../apiCalls/auth';
import toast from 'react-hot-toast';
import PopupDialog from '../../components/PopupDialog';

const ProfileSecurity = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [activeTab, setActiveTab] = useState('password');
    const [showDialog , setShowDialog] = useState(false); // Tracks active tab

    const [errors, setErrors] = useState({});

    const handlePasswordUpdate = async () => {
        let validationErrors = {};
        if (!currentPassword) validationErrors.currentPassword = "Current password is required";
        if (!newPassword) validationErrors.newPassword = "New password is required";
        if (!confirmPassword) validationErrors.confirmPassword = "Confirm password is required";
        if (currentPassword === newPassword) validationErrors.newPassword = "New password should not be the same as current password";
        if (newPassword.length < 8) validationErrors.newPassword = "New password should be at least 8 characters long";
        if (newPassword !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            const response = await changeCurrentPassword({ newPassword, oldPassword: currentPassword });
            if (response.status === 200) {
                toast.success('Password updated successfully');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const cancelShowDialog = async ()=> {
        setShowDialog(false);
    }
    
    const handleTwoFactorToggle = async () => {
        setTwoFactorEnabled(!twoFactorEnabled);
        setShowDialog(false);
    }

    const getPopupDialogContent = ()=> {
        return {
            title: !twoFactorEnabled ? "Enable Two Factor Verification" : "Disable Two Factor Verification",
            message: !twoFactorEnabled ? "Do you want to enable two factor verification": "Do you want to disable two factor verification",
            onConfirm:handleTwoFactorToggle,
            onCancel: cancelShowDialog,
            buttonText: "Yes",
            type : twoFactorEnabled ? "danger" : "info"
        }

    }
    

    return (
        <div className="security-container">
            <ProfileHeader />
            <div className="security-layout">
                <ProfileSidebar />
                <div className="security-content">
                    <h2>Profile Security</h2>

                    {/* Bootstrap Tabs */}
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'password' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('password')}
                            >
                                Change Password
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === '2fa' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('2fa')}
                            >
                                Two-Step Verification
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content mt-3">
                        {activeTab === 'password' && (
                            <div className="security-section">
                                <h3>Password Management</h3>
                                <div className='mb-3'>
                                    <input 
                                        type="password" 
                                        placeholder="Current Password" 
                                        className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`} 
                                        value={currentPassword} 
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
                                </div>
                                <div className='mb-3'>
                                    <input 
                                        type="password" 
                                        className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`} 
                                        placeholder="New Password" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                                </div>
                                <div className='mb-3'>
                                    <input 
                                        type="password" 
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} 
                                        placeholder="Confirm New Password" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                </div>
                                <button className="update-btn" onClick={handlePasswordUpdate}>
                                    Update Password
                                </button>
                            </div>
                        )}

                        {activeTab === '2fa' && (
                            <>
                                <div className="security-section">
                                    <h3>Two-Factor Authentication</h3>
                                    <button 
                                        className={`toggle-btn ${twoFactorEnabled ? 'enabled' : 'disabled'}`} 
                                        onClick={() => {
                                            
                                            setShowDialog(true) 
                                        }}
                                    >
                                        {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                    </button>
                                </div>

                                { showDialog && <PopupDialog {...getPopupDialogContent()} />}
                            </>

                            
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurity;
