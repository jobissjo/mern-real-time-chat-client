import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { signupUser } from '../../apiCalls/auth';
import toast from 'react-hot-toast';
import { Button, Box, Typography } from '@mui/material';


const VerifyAccount = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation()
  const navigate = useNavigate()
  const user = location.state.user;
  const [loading, setLoading] = useState(false);

  async function onFormSubmit(event) {
    event.preventDefault()
    try {
      const data = { ...user, otp }
      setLoading(true);
      const response = await signupUser(data);
      setLoading(false);
      if (response.status === 200) {
        toast.success("Account created successfully");
        setTimeout(() => {
          navigate('/login')
        }, 500)
      }
    }
    catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message ?? 'Something went wrong')
    }
  }

  return (
    <Box className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <Box className="card" p={4} boxShadow={3} borderRadius={2} bgcolor="background.paper" textAlign="center">
        <Typography variant="h4" gutterBottom>
          Verify Account
        </Typography>
        <form onSubmit={onFormSubmit} className="form">
          <Box display="flex" justifyContent="center" mb={2}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputStyle={{
                width: "3rem",
                height: "3rem",
                borderRadius: 4,
                padding: 0,
                border: "1px solid rgba(0,0,0,0.23)"
              }}
              renderInput={(inputProps, index) => (
                <input {...inputProps} />
              )}
            />
          </Box>
          <Button type="submit" loadingPosition="center"  variant="contained" fullWidth loading={loading} className="form button">
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
        <Typography variant="body2" mt={2}>
          Didn't receive the OTP? <Link to="#">Resend OTP</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default VerifyAccount;