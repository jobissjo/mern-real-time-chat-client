import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from "@mui/material";
import { Close, WarningAmber, CheckCircle, ErrorOutline, InfoOutlined } from "@mui/icons-material";

const iconStyles = {
  danger: { icon: <ErrorOutline color="error" fontSize="large" />, color: "error" },
  success: { icon: <CheckCircle color="success" fontSize="large" />, color: "success" },
  warning: { icon: <WarningAmber color="warning" fontSize="large" />, color: "warning" },
  info: { icon: <InfoOutlined color="primary" fontSize="large" />, color: "primary" },
};

const PopupDialog = ({ open, title, message, type = "warning", onCancel, onConfirm, buttonText = "OK", cancelText = "Cancel" }) => {
  const { icon, color } = iconStyles[type] || iconStyles.warning;

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon}
        <Typography variant="h6" color={color}>
          {title}
        </Typography>
        <IconButton onClick={onCancel} sx={{ marginLeft: "auto" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="inherit" variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={color} variant="contained">
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PopupDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["danger", "success", "warning", "info"]),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default PopupDialog;
