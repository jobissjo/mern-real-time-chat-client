import React from "react";
import PropTypes from 'prop-types';
import { TextField } from "@mui/material";

const SearchUser = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label="Search by name"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}

      sx={{ mb: 2 }}
      
      slotProps={{
        input: {
          sx: {
            color: "var(--text-color)", // Input text color
            "&::placeholder": {
              color: "var(--sub-text-color)", // Placeholder color
              opacity: 0.7, // Adjust opacity for better visibility
            },
          },
        },
        inputLabel: {
          sx: {
            color: "var(--text-color)", // Label text color
          },
        },
        notchedOutline: {
          sx: {
            borderColor: "var(--text-color)", // Outline border color
          },
        },
      }}
    />
  );
};
SearchUser.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default SearchUser;
