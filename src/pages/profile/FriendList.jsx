import React, { useEffect, useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import './profile.css';
import { acceptFriendRequest, getAllFriendRequests } from '../../apiCalls/friendRequest';
import { getFriendsList } from '../../apiCalls/user';
import toast from 'react-hot-toast';



const FriendList = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);

    const getFriendRequests = async () => {
        try{
            const response = await getAllFriendRequests();
            if(response.status === 200){
                setFriendRequests(response?.data?.data);
            }
            else{
                toast.error(response.error.message)
            }
        }
        catch(error){
            console.error('Error fetching friend requests:', error);
        }
    }

    const getFriendsListOfUser = async () => {
        try{
            const response = await getFriendsList();
            if(response.status === 200){
                setFriends(response?.data?.data);
            }
            else{
                toast.error(response.error.message)
            }
        }
        catch(error){
            console.error('Error fetching friends list:', error);
        }
    }

    const acceptFriendRequestOfUser = async (requestId) => {
        try{
            const request = await acceptFriendRequest(requestId);
            if(request.status === 200){
                toast.success(request.data?.message);
                getFriendRequests();
                getFriendsListOfUser();
            }
        }
        catch(error){
            toast.error(error.response?.data?.message);
        }
    }

    useEffect(()=> {
        getFriendRequests();
        getFriendsListOfUser();
        
    }, [])


    const rejectFriendRequest = (id) => {
        setFriendRequests(friendRequests.filter(friend => friend.id !== id));
    };

    return (
        <div className="friends-container">
            <ProfileHeader />
            <div className="friends-layout">
                <ProfileSidebar />
                <div className="friends-content">
                    {/* Friend Requests Section */}
                    <h2>Friend Requests</h2>
                    {friendRequests.length > 0 ? (
                        <ul className="friend-request-list">
                            {friendRequests.map(friend => (
                                <li key={friend._id} className="friend-request-item">
                                    <div className='friend-request-info'>
                                        <i className="fa fa-user-circle friend-icon"></i>
                                        <div className="friend-info">
                                            <span className="friend-request-name">{friend.name}</span>
                                        </div>
                                    </div>
                                    <div className="friend-request-actions">
                                        <button className="accept-btn" onClick={() => acceptFriendRequestOfUser(friend._id)}>Accept</button>
                                        <button className="reject-btn" onClick={() => rejectFriendRequest(friend.id)}>Reject</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No new friend requests.</p>
                    )}

                    {/* Friends List Section */}
                    <h2>Friends List</h2>
                    <ul className="friend-list">
                        { friendRequests.length > 0 ? friends.map(friend => (
                            <li key={friend._id} className="friend-item">
                                <i className="fa fa-user-circle friend-icon"></i>
                                <div className="friend-info">
                                    <span className="friend-name">{friend.name}</span>
                                    <span className={`friend-status ${friend.status.toLowerCase()}`}>
                                        {friend.status}
                                    </span>
                                </div>
                            </li>
                        )) : 
                        (<p>No new friend requests.</p>)
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FriendList;
