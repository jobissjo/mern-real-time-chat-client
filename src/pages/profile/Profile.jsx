import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePicture } from "../../apiCalls/user";
import { hideLoader, showLoader } from "../../redux/loaderSlice";
import toast from "react-hot-toast";
import ProfileSidebar from "./ProfileSidebar";
import ProfileHeader from "./ProfileHeader";
import { Box, Button, Avatar, Typography, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const Profile = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [image, setImage] = useState("");
  const dispatch = useDispatch();

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

  const uploadProfilePic = async () => {
    if (!image) {
      toast.error("Please select a profile picture");
      return;
    }
    try {
      dispatch(showLoader());
      const [response_data, status_code] = await updateProfilePicture(image);
      dispatch(hideLoader());

      if (status_code === 200) {
        toast.success("Profile image updated successfully");
      } else {
        toast.error(response_data.message);
      }
    } catch (error) {
      dispatch(hideLoader());
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
                color: "#fff",
                "&:hover": { bgcolor: "var(--primary-color);" , color: "black"},
              }}
            >
              <PhotoCamera />
              <input type="file" hidden onChange={handleImageUpload} />
            </IconButton>
          </Box>

          {/* Profile Info */}
          <Typography sx={{color: 'var(--text-color)'}} variant="h5">{user?.firstName} {user?.lastName}</Typography>
          <Typography sx={{color: 'var(--text-color)'}} variant="body1"><b>Email:</b> {user?.email}</Typography>
          <Typography sx={{color: 'var(--text-color)'}} variant="body1"><b>Account Created:</b> {moment(user?.createdAt).format("DD MMMM YYYY")}</Typography>

          {/* Upload Button */}
          <Button
            variant="contained"
            sx={{ mt: 2, bgcolor: "#ff5b5b", "&:hover": { bgcolor: "var(--primary-color);", color: 'black' } }}
            onClick={uploadProfilePic}
          >
            Upload Profile Picture
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
