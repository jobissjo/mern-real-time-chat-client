import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePicture, updateUserProfile } from "../../apiCalls/user";
import { hideLoader, showLoader } from "../../redux/loaderSlice";
import toast from "react-hot-toast";
import ProfileSidebar from "./ProfileSidebar";
import ProfileHeader from "./ProfileHeader";
import { Box, Button, Avatar, Typography, IconButton, TextField, MenuItem } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { setUser } from "../../redux/userSlice";


const Profile = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({
    bio: user?.bio || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
  });

  useEffect(() => {
    if (user) {
      setImage(user.profilePic);
      setUserDetails({
        bio: user.bio || "",
        dob: user.dob || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.profilePic) {
      setImage(user.profilePic);
    }
  }, [user]);

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        setImage(reader.result);
      };
    }
  };

  const handleSaveProfile = async () => {
    try {
      // dispatch(showLoader());
      debugger
      const response = await updateUserProfile(userDetails);
      if (response.status === 200) {
        dispatch(setUser(response.data?.data));
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      // dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  const uploadProfilePic = async () => {
    if (!image) {
      toast.error("Please select a profile picture");
      return;
    }
    try {

      const [response_data, status_code] = await updateProfilePicture(image);


      if (status_code === 200) {
        toast.success("Profile image updated successfully");
      } else {
        toast.error(response_data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100dvh", background: 'var(--primary-color)', color: "text.primary" }}>
      <ProfileHeader />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <ProfileSidebar />
        <Box sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Profile Picture Section */}
          <Box sx={{ position: "relative", mb: 2 }}>
            <Avatar
              src={image || "/images/profile.png"}
              sx={{ width: 120, height: 120, boxShadow: 3 }}
            />
            <IconButton
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "#ff5b5b",
                color: "white",
                borderColor: 'var(--button-color)',  "&:hover": { bgcolor: 'var(--icon-button-hover-color)', color: "white" } 
              }}
            >
              <PhotoCamera />
              <input type="file" hidden onChange={handleImageUpload} />
            </IconButton>
          </Box>

          {/* Profile Info */}
          <Typography sx={{ color: 'var(--text-color)' }} variant="h5">{user?.firstName} {user?.lastName}</Typography>
          <Typography sx={{ color: 'var(--text-color)' }} variant="body1"><b>Email:</b> {user?.email}</Typography>
          <Typography sx={{ color: 'var(--text-color)' }} variant="body1"><b>Account Created:</b> {moment(user?.createdAt).format("DD MMMM YYYY")}</Typography>

          {/* Upload Button */}
          <Button
            variant="outlined"
            sx={{ mt: 1, borderColor: 'var(--button-color)', color: 'var(--button-color)', "&:hover": { bgcolor: 'var(--button-color)', color: "white" } }}

            onClick={uploadProfilePic}
          >
            Upload Profile Picture
          </Button>
          <Box sx={{ width: "100%", maxWidth: 400, mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-color)' }}>
              Update Profile Info
            </Typography>

            {/* Bio */}
            <TextField
              label="Bio"
              variant="outlined"
              fullWidth
              value={userDetails.bio}
              onChange={(e) => setUserDetails({ ...userDetails, bio: e.target.value })}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    color: 'var(--text-color)',
                    '&::placeholder': {
                      color: 'var(--text-color)',
                      opacity: 0.7
                    }
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--secondary-color)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text-color)',
                  opacity: 0.7,
                  '&.Mui-focused': {
                    color: 'var(--secondary-color)'
                  }
                }
              }}
            />

            {/* Date of Birth */}
            <TextField
              label="Date of Birth"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={userDetails.dob?.split("T")[0] || ""}
              onChange={(e) => setUserDetails({ ...userDetails, dob: e.target.value })}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    color: 'var(--text-color)',
                    '&::placeholder': {
                      color: 'var(--text-color)',
                      opacity: 0.7
                    }
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--secondary-color)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text-color)',
                  opacity: 0.7,
                  '&.Mui-focused': {
                    color: 'var(--secondary-color)'
                  }
                }
              }}
            />

            {/* Gender */}
            <TextField
              select
              label="Gender"
              variant="outlined"
              fullWidth
              value={userDetails.gender}
              onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& .MuiSelect-select': {
                    color: 'var(--text-color)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--secondary-color)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text-color)',
                  opacity: 0.7,
                  '&.Mui-focused': {
                    color: 'var(--secondary-color)'
                  }
                }
              }}
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

            {/* Save Button */}
            <Button
              variant="outlined"
              sx={{ mt: 1, borderColor: 'var(--button-color)', color: 'var(--button-color)', "&:hover": { bgcolor: 'var(--button-color)', color: "white" } }}
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
