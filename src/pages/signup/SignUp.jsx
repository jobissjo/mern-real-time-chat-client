import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import { signupUser } from '../../apiCalls/auth';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/loaderSlice';


const SignUp = () => {
  
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const dispatch = useDispatch()

  async function onFormSubmit(event){
    event.preventDefault();
    try {
      dispatch(showLoader());
      const response = await signupUser(user);
      dispatch(hideLoader());
      if (response.success){
        alert(response.message + "success response");
      }
      else{
        alert(response.message);
      }
    }
    catch (error) {
      alert(response.message);
    }

  }

  // console.log(user);

  return (
    <div className="container">
        <div className="container-back-img"></div>
        <div className="container-back-color"></div>
        <div className="card">
            <div className="card_title">
                <h1>Create Account</h1>
            </div>
            <div className="form">
                <form onSubmit={onFormSubmit}>
                    <div className="column">
                        <input type="text" placeholder="First Name" value={user.firstName}
                        onChange={(e)=> setUser({...user, firstName:e.target.value})} />
                        <input type="text" placeholder="Last Name" value={user.lastName}
                        onChange={(e)=> setUser({...user, lastName:e.target.value})} />
                    </div>
                    <input type="email" placeholder="Email" value={user.email}
                    onChange={(e)=> setUser({...user, email:e.target.value})} />
                    <input type="password" placeholder="Password" value={user.password}
                    onChange={(e)=> setUser({...user, password:e.target.value})} />
                    <button>Sign Up</button>
                </form>
            </div>
            <div className="card_terms">
                <span>Already have an account?
                  <Link to="/login">Login Here</Link>

                </span>
            </div>
        </div>
    </div>

  )
}

export default SignUp