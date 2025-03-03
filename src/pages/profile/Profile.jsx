import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePicture } from '../../apiCalls/user';
import { hideLoader, showLoader } from '../../redux/loaderSlice';
import toast from 'react-hot-toast';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import './profile.css'


const Profile = () => {
    const { user } = useSelector(state => state.userReducer);
    const [image, setImage] = useState('');
    const dispatch = useDispatch();

    function getInitials() {
        return user.firstName?.toUpperCase().charAt(0) + user.lastName?.toUpperCase().charAt(0);
    }

    const handleImageUpload = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader(file);
            reader.readAsDataURL(file);

            reader.onloadend = async () => {
                setImage(reader.result);
            };
        }
    };

    const uploadProfilePic = async () => {
        if (!image) {
            toast.error('Please select a profile picture');
            return;
        }
        try {
            dispatch(showLoader());
            const [response_data, status_code] = await updateProfilePicture(image);
            dispatch(hideLoader());
            if (status_code === 200) {
                toast.success('Profile image updated successfully');
            } else {
                toast.error(response_data.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user.profilePic) {
            setImage(user.profilePic);
        }
    }, [user]);

    return (
        <div className="profile-container">
            <ProfileHeader />
            <div className="profile-layout">
                <ProfileSidebar />
                <div className="profile-content">
                    <div className="profile-pic-container">
                        {image ? (
                            <img src={image} alt="Profile Pic" className="user-profile-pic-upload" />
                        ) : (
                            <div className="user-default-profile-avatar">{getInitials()}</div>
                        )}
                    </div>

                    <div className="profile-info-container">
                        <h2>{user?.firstName} {user?.lastName}</h2>
                        <p><b>Email:</b> {user?.email}</p>
                        <p><b>Account Created:</b> {moment(user?.createdAt).format('DD MMMM YYYY')}</p>
                        <div className="select-profile-pic-container">
                            <input type="file" onChange={handleImageUpload} />
                            <button onClick={uploadProfilePic} className="upload-btn">Upload</button>
                        </div>
                    </div>
                    <div className='profile-dummy-container'>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
