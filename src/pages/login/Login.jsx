import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { loginUser } from '../../apiCalls/auth'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/loaderSlice';

const Login = () => {
  const [user, setUser] = useState({email: '', password: ''});
  const navigate = useNavigate();
  const dispatch = useDispatch()

  async function onFormSubmit(event) {
    event.preventDefault()
    let response, status_code;
    dispatch(showLoader());

    [response, status_code] = await loginUser(user);

    dispatch(hideLoader());

    if (status_code == 200){
      toast.success(response.message)
      setUser({email: '', password: ''})
      
      navigate('/')
    }
    else{
      toast.error(response.message)
    }
  }

  return (
    <div className="container">
        <div className="container-back-img"></div>
        <div className="container-back-color"></div>
        <div className="card">
        <div className="card_title">
            <h1>Login Here</h1>
        </div>
        <div className="form">
        <form onSubmit={onFormSubmit}>
            <input type="email" placeholder="Email" value={user.email}
            onChange={(e)=> setUser({...user, email: e.target.value})}/>
            <input type="password" placeholder="Password" value={user.password}
             onChange={(e)=> setUser({...user, password: e.target.value})} />
            <button>Login</button>
        </form>
        </div>
        <div className="card_terms"> 
            <span>Don't have an account yet?
                <Link to="/signup">Signup Here</Link>
            </span>
        </div>
        </div>
    </div>
  )
}

export default Login