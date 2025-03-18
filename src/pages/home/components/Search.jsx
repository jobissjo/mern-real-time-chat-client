import React from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Search = ({ searchKey, setSearchKey }) => {
  return (
    <TextField
      style={{color: "var(--text-color)"}}
      variant="outlined"
      fullWidth
      placeholder="Search..."
      value={searchKey}
      onChange={(e) => setSearchKey(e.target.value)}
      sx={{
        '& .MuiInputBase-input::placeholder': {
          color: 'var(--sub-text-color)', // <-- Change your placeholder color here
          opacity: 1, // Ensure it is fully visible
        },
      }}
      slots={{
        endAdornment: InputAdornment,
      }}
      slotProps={{
        endAdornment: {
          position: 'end',
          children: <SearchIcon />,
        },
      }}
    />
  );
};
Search.propTypes = {
  searchKey: PropTypes.string.isRequired,
  setSearchKey: PropTypes.func.isRequired,
};

export default Search;
