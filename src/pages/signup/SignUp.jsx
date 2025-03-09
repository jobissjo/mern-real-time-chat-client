import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, verifyAccount } from '../../apiCalls/auth';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/loaderSlice';
import toast from 'react-hot-toast';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const SignUp = () => {

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  async function onFormSubmit(event) {
    event.preventDefault();
    const errors = {};
    if (!user.firstName) errors.firstName = "First Name is required";
    if (!user.email) errors.email = "Email is required";
    if (!user.password) errors.password = "Password is required";
    if (user?.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) errors.email = "Invalid email format";
    if (user.password.length < 8) errors.password = "Password must be at least 8 characters long";

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    try {
      setLoading(true);
      const [response, status_code] = await verifyAccount(user.email, user.firstName);
      setLoading(false);
      if (status_code === 200) {
        toast.success(response.message);
        navigate('/verify-account', { state: { user } });
      }
      else {
        toast.error(response.message);
      }

    }
    catch (error) {
      setLoading(false);
      toast.error(error.message);
    }

  }


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
            <TextField id="outlined-basic" label="First Name *" variant="outlined" value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              error={formError.firstName}
              helperText={formError.firstName}
              fullWidth
              margin="normal"


            />

            <TextField id="outlined-basic" label="Last Name" variant="outlined" value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              error={formError.lastName}
              helperText={formError.lastName}
              fullWidth
              margin="normal"


            />

            <TextField id="outlined-basic" label="Email *" variant="outlined" value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              error={formError.email}
              helperText={formError.email}
              fullWidth
              margin="normal"

            />

            <TextField id="outlined-basic" label="Password *" variant="outlined" value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              error={formError.password}
              helperText={formError.password}
              fullWidth
              margin="normal"

            />

            {/* <button>Sign Up</button> */}

            <Button
              type="submit"
              size="small"
              onClick={() => { }}
              // endIcon={<LoginIcon />}
              loading={loading}
              loadingPosition="center"
              variant="contained"

            >
              Login
            </Button>
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