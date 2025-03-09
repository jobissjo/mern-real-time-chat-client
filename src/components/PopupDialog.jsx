import React from "react";
import PropTypes from "prop-types";
import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

const dialogStyles = {
  danger: {
    icon: <XCircle className="text-danger" size={24} />, // Bootstrap's danger class
    headerClass: "text-danger",
    buttonClass: "btn btn-danger",
  },
  success: {
    icon: <CheckCircle className="text-success" size={24} />,
    headerClass: "text-success",
    buttonClass: "btn btn-success",
  },
  warning: {
    icon: <AlertTriangle className="text-warning" size={24} />,
    headerClass: "text-warning",
    buttonClass: "btn btn-warning",
  },
  info: {
    icon: <Info className="text-primary" size={24} />,
    headerClass: "text-primary",
    buttonClass: "btn btn-primary",
  },
};

const PopupDialog = ({ title, message, type = "warning", onCancel, onConfirm, buttonText = "OK" }) => {
  const { icon, headerClass, buttonClass } = dialogStyles[type] || dialogStyles.warning;

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <div className="d-flex align-items-center gap-2">
              {icon}
              <h5 className={`modal-title ${headerClass}`}>{title}</h5>
            </div>
            <button type="button" className="btn-close" onClick={onCancel} aria-label="Close"></button>
          </div>

          {/* Message */}
          <div className="modal-body">
            <p>{message}</p>
          </div>

          {/* Footer Buttons */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className={buttonClass} onClick={onConfirm}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

PopupDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["danger", "success", "warning", "info"]),
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  buttonText: PropTypes.string,
};

export default PopupDialog;