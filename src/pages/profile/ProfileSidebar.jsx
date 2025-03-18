import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { Person, Group, Notifications, Settings, Security, ExitToApp, Menu } from "@mui/icons-material";

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    // Uncomment if using socket & dispatch
    // socket.emit("user-logout", user._id);
    // dispatch(logoutUser());
  };

  const menuItems = [
    { text: "Profile", icon: <Person />, path: "/profile" },
    { text: "Friends", icon: <Group />, path: "/friends" },
    { text: "Notifications", icon: <Notifications />, path: "/notifications" },
    { text: "Preferences", icon: <Settings />, path: "/preferences" },
    { text: "Security", icon: <Security />, path: "/security" },
    { text: "Logout", icon: <ExitToApp />, action: logout }
  ];

  return (
    <>
      {/* Menu Icon for Mobile */}
      <IconButton onClick={() => setOpen(true)} sx={{ position: "fixed", top: 10, left: 10, color: "var(--text-color)" }}>
        <Menu />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} sx={{}}>
        <List sx={{ width: 250, backgroundColor: "var(--secondary-color)", height: '100dvh' }}>
          {menuItems.map(({ text, icon, path, action }) => (
            <ListItemButton key={text} onClick={() => { action ? action() : navigate(path); setOpen(false); }}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default ProfileSidebar;
