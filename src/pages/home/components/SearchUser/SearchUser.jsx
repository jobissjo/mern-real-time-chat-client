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
    />
  );
};
SearchUser.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default SearchUser;
