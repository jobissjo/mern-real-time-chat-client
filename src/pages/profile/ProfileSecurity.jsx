import React, { useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import { TextField, Button, Tabs, Tab, Box, Typography, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { changeCurrentPassword } from '../../apiCalls/auth';
import toast from 'react-hot-toast';
import PopupDialog from '../../components/PopupDialog';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPreferences } from '../../apiCalls/preference';
import { setPreference } from '../../redux/userSlice';
const ProfileSecurity = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [errors, setErrors] = useState({});

    const {preference } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()

    const handlePasswordUpdate = async () => {
        let validationErrors = {};
        if (!currentPassword) validationErrors.currentPassword = "Current password is required";
        if (!newPassword) validationErrors.newPassword = "New password is required";
        if (!confirmPassword) validationErrors.confirmPassword = "Confirm password is required";
        if (currentPassword === newPassword) validationErrors.newPassword = "New password should not be the same as current password";
        if (newPassword.length < 8) validationErrors.newPassword = "New password should be at least 8 characters long";
        if (newPassword !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const response = await changeCurrentPassword({ newPassword, oldPassword: currentPassword });
            if (response.status === 200) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword(''); 
                toast.success('Password updated successfully');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            debugger
            toast.error(error.response?.data?.message);
        }
    };


    const handleTwoFactorToggle = async () => {
        try{
            const response = await updateUserPreferences({twoFactorAuthentication: !preference.twoFactorAuthentication});
            setShowDialog(false);
            if (response.status === 200) {
                dispatch(setPreference({...preference, twoFactorAuthentication:!preference.twoFactorAuthentication}))
            }

        }
        catch (error) {
            setShowDialog(false);
        }
        
        // setTwoFactorEnabled(!twoFactorEnabled);
        
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column',  }}>
            <ProfileHeader />
            <Box sx={{ display: 'flex', gap: 2 }}>
                <ProfileSidebar />
                <Box sx={{ flexGrow: 1, p: 3, height: '100dvh', backgroundColor: 'var(--primary-color)', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h5" sx={{color: 'var(--text-color)'}}>Profile Security</Typography>
                    <Tabs value={activeTab} sx={{color: 'var(--text-color)'}} onChange={(_, newValue) => setActiveTab(newValue)}>
                        <Tab label="Change Password"  />
                        <Tab label="Two-Factor Authentication" />
                    </Tabs>
                    {activeTab === 0 && (
                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h6" sx={{color: 'var(--text-color)'}}>Password Management</Typography>
                            <TextField
                                type="password"
                                label="Current Password"
                                fullWidth
                                error={!!errors.currentPassword}
                                helperText={errors.currentPassword}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                sx={{ 
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                      '& input': {
                                        color: 'var(--text-color)',
                                        '&::placeholder': {
                                          color: 'var(--text-color)',
                                          opacity: 0.7
                                        }
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: 'var(--secondary-color)'
                                      }
                                    },
                                    '& .MuiInputLabel-root': {
                                      color: 'var(--text-color)',
                                      opacity: 0.7,
                                      '&.Mui-focused': {
                                        color: 'var(--secondary-color)'
                                      }
                                    }
                                  }}
                            />
                            <TextField
                                type="password"
                                label="New Password"
                                fullWidth
                                error={!!errors.newPassword}
                                helperText={errors.newPassword}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                sx={{ 
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                      '& input': {
                                        color: 'var(--text-color)',
                                        '&::placeholder': {
                                          color: 'var(--text-color)',
                                          opacity: 0.7
                                        }
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: 'var(--secondary-color)'
                                      }
                                    },
                                    '& .MuiInputLabel-root': {
                                      color: 'var(--text-color)',
                                      opacity: 0.7,
                                      '&.Mui-focused': {
                                        color: 'var(--secondary-color)'
                                      }
                                    }
                                  }}
                            />
                            <TextField
                                type="password"
                                label="Confirm New Password"
                                fullWidth
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={{ 
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                      '& input': {
                                        color: 'var(--text-color)',
                                        '&::placeholder': {
                                          color: 'var(--text-color)',
                                          opacity: 0.7
                                        }
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: 'var(--secondary-color)'
                                      }
                                    },
                                    '& .MuiInputLabel-root': {
                                      color: 'var(--text-color)',
                                      opacity: 0.7,
                                      '&.Mui-focused': {
                                        color: 'var(--secondary-color)'
                                      }
                                    }
                                  }}
                            />
                            <Button variant="contained" style={{backgroundColor: '#ff5b5b'}} onClick={handlePasswordUpdate}>Update Password</Button>
                        </Box>
                    )}
                    {activeTab === 1 && (
                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h6"sx={{color: 'var(--text-color)'}} >Two-Factor Authentication</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography sx={{color: 'var(--text-color)'}}>{preference?.twoFactorAuthentication ? 'Disable 2FA' : 'Enable 2FA'}</Typography>
                                <Switch sx={{color: 'var(--text-color)'}} checked={preference?.twoFactorAuthentication} onChange={() => setShowDialog(true)} />
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
            <PopupDialog
                open={showDialog}
                title={preference?.twoFactorAuthentication ? "Disable Two-Factor Authentication" : "Enable Two-Factor Authentication"}
                message={!preference?.twoFactorAuthentication ? "Do you want to enable two-factor authentication?" : "Do you want to disable two-factor authentication?"}
                type={!preference?.twoFactorAuthentication ? "info" : 'warning'}
                onCancel={() => setShowDialog(false)}
                onConfirm={() => {
                    handleTwoFactorToggle()
                }}
                buttonText="Yes"
                cancelText="No"
            />;
        </Box>
    );
};

export default ProfileSecurity;
