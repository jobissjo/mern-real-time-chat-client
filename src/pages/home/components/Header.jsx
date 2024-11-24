import React from 'react'
import { useSelector } from 'react-redux'

const Header = () => {
    const { user } = useSelector(state => state.userReducer);
    function getFullName(){
        return user.firstName + " " + user.lastName;
    }
    function getInitials(){
        return user.firstName.toUpperCase().charAt(0) + user.lastName.toUpperCase().charAt(0);
    }
  return (
    <div className="app-header">
    <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
          Quick Chat
        </div>
    <div className="app-user-profile">
        <div className="logged-user-name">{getFullName()}</div>
        <div className="logged-user-profile-pic">JS</div>
    </div>
</div>

  )
}

export default Header;