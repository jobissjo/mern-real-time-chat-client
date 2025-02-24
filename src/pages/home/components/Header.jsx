import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const Header = ({socket}) => {
    const { user } = useSelector(state => state.userReducer);
    const navigate = useNavigate()
    function getFullName(){
        return user.firstName + " " + user.lastName;
    }
    function getInitials(){
        return user.firstName?.toUpperCase().charAt(0) + user.lastName?.toUpperCase().charAt(0);
    }
    console.log(user);

    const logOut = async ()=> {
      localStorage.removeItem('token')
      navigate('/login');
      socket.emit('user-logout', user._id)
        
    }
    
  return (
    <div className="app-header">
    <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
          Quick Chat
        </div>
    <div className="app-user-profile">
        <div className="logged-user-name">{getFullName()}</div>
        {
          !user?.profilePic && <div className="logged-user-profile-pic" onClick={e => {navigate('/profile')}} >{getInitials()}</div>
        }
        { user?.profilePic && 
          <img className="logged-user-profile-pic" src={user?.profilePic} alt={user?.firstName} onClick={e => {navigate('/profile')}} />

        }
        <button className='logout-button' onClick={logOut}>
          <i className='fa fa-power-off'></i>
        </button>
    
    </div>
  
  </div>

  )
}

export default Header;