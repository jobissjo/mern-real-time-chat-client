import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { signupUser } from '../../apiCalls/auth';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/loaderSlice';

const VerifyAccount = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = location.state.user;
  console.log("user:", user);
  

  async function onFormSubmit(event) {
    event.preventDefault()
    const data = {...user, otp}
    const [response, statuCode] = await signupUser(data);
    if (statuCode === 200){
      toast.success("Account created successfully");
      dispatch(showLoader())
      setTimeout(()=> {
        dispatch(hideLoader())
        navigate('/login')
      },1000)
    }
    else{
      toast.warning(response?.message ?? 'Something went wrong')
    }
  }

  return (
    <div className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card_title">
          <h1>Verify Account</h1>
        </div>
        <div className="form">
          <form onSubmit={onFormSubmit}>
            <div className="column">
              <OtpInput
                value={otp}
                onChange={(otp) => {
                  setOtp(otp)
                  console.log('OTP:', otp);
                }}
                numInputs={6}
                renderInput={(props) => <input {...props} style={{ color: 'black' }} />}
              />
            </div>
            <button type="submit">Verify</button>
          </form>
        </div>
        <div className="card_terms">
          <span>Didn't receive the OTP? <Link to="#">Resend OTP</Link></span>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
