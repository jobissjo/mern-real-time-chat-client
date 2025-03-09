import { useNavigate } from "react-router-dom";

const ProfileHeader = () => {

    const navigate = useNavigate()

    const logOut = async () => {
        localStorage.removeItem('token')
        navigate('/login');
        // socket.emit('user-logout', user._id)

    }
    return (
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ backgroundColor: "#fdedec" }}>
            <div className="d-flex align-items-center">
                <i className="fa fa-comments" aria-hidden="true" onClick={()=> {navigate('/')}} style={{ fontSize: "28px", marginRight: "10px" , cursor:"pointer"}}></i>
                <h4 className="mb-0" onClick={()=> {navigate('/')}}>Quick Chat</h4>
            </div>
            <button className='logout-button' onClick={logOut} style={{ fontSize: "18px", padding: "8px 12px" }}>
                <i className='fa fa-power-off'></i>
            </button>
        </div>
    );
};


export default ProfileHeader;