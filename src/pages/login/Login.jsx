import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { loginUser } from '../../apiCalls/auth'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; 
import Button from '@mui/material/Button';
import { TextField, InputAdornment, IconButton } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState({ email: null, password: null });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onFormSubmit(event) {
    event.preventDefault();
    let response, status_code;
    let errors = {};
    if (!user.email) {
      errors.email = "Email is required";
    }
    if (!user.password) {
      errors.password = "Password is required";
    }
    if(user?.password && user?.password.length < 8){
      errors.password = "Password should be at least 8 characters long";
    }

    setFormError(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      [response, status_code] = await loginUser(user);
      if (status_code == 200) {
        toast.success(response.message)
        setUser({ email: '', password: '' })

        setTimeout(() => {
          console.log("try to navigate to home page");

          navigate('/')
        }, [1000])
      }
      else {
        console.log(response);
        
        toast.error(response.message)
      }
    }, 1000)





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
            {/* <input type="email" placeholder="Email" value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })} /> */}

            <TextField id="outlined-basic" label="Email" variant="outlined" value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              error={formError.email}
              helperText={formError.email}
              fullWidth
              type='email'

            />

            <TextField id="outlined-basic" label="Password" variant="outlined" value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              error={formError.password}
              helperText={formError.password}
              fullWidth
              margin="normal" 
              // type='password'
              type={showPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={()=> setShowPassword(prev => !prev)}
                        edge="end"
                      >
                        {showPassword ? <Visibility />: <VisibilityOff /> }
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}


            />
            
            {/* <button>Login</button> */}
            <Button
              type="submit"
              size="small"
              onClick={() => { }}
              endIcon={<LoginIcon />}
              loading={loading}
              loadingPosition="center"
              variant="contained"

            >
              Login
            </Button>
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