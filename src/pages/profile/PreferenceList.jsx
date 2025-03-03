import React, { useEffect, useReducer, useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import './profile.css'; // ✅ Shared CSS import
import { getUserPreferences, updateUserPreferences } from '../../apiCalls/preference';
import toast from 'react-hot-toast/headless';

const PreferenceList = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNotification, setIsNotification] = useState(true);
    const [language, setLanguage] = useState('en');



    const fetchUserPreference = async () => {
        
        try{
            const response = await getUserPreferences();       
            if(response.status === 200){
                toast.success(response.data?.message);
                setIsDarkMode(response.data.data?.isDarkMode ?? false);
                setIsNotification(response.data.data?.isNotification ?? true);
                setLanguage(response.data.data?.language);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const updatePreferences = async function(updatedData){
        try{
            const response = await updateUserPreferences(updatedData);
            if(response.status === 200){
                toast.success(response.data?.message);
                fetchUserPreference()
            }
            else{
                toast.error(response.data.message);
            }

        }
        catch(error){
            toast.error(error.message);
        }

    }

    useEffect(()=> {
        fetchUserPreference();
    }, []);

    useEffect(()=> {
        updatePreferences({ isDarkMode, isNotification, language });
        
    }, [isDarkMode, isNotification, language])

    return (
        <div className="preferences-container">
            <ProfileHeader />
            <div className="preferences-layout">
                <ProfileSidebar />
                <div className="preferences-content">
                    <h2>Preferences</h2>

                    <div className="preference-item">
                        <label>Dark Mode</label>
                        <button 
                            className={`toggle-btn ${isDarkMode ? 'enabled' : 'disabled'}`} 
                            onClick={() => {
                                setIsDarkMode(prev => !prev)
                            }}
                        >
                            {isDarkMode ? 'Enabled' : 'Disabled'}
                        </button>
                    </div>

                    <div className="preference-item">
                        <label>Notifications</label>
                        <button 
                            className={`toggle-btn ${isNotification ? 'enabled' : 'disabled'}`} 
                            onClick={() => {
                                setIsNotification(prev => !prev)
                            }}
                        >
                            {isNotification ? 'On' : 'Off'}
                        </button>
                    </div>

                    <div className="preference-item">
                        <label>Language</label>
                        <select 
                            className="dropdown" 
                            value={language} 
                            onChange={(e) => {
                                setLanguage(e.target.value);
                            }}
                        >
                            
                            <option value="sp">Spanish</option>
                            <option value="fr">French</option>
                            <option value="gr">German</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreferenceList;
