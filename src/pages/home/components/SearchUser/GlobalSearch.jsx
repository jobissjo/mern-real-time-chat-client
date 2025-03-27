import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Container, Typography } from "@mui/material";
import Header from "../Header";
import SearchUser from "./SearchUser";
import SearchUserList from "./SearchUserList";
import { getGlobalSearchFriendsList } from "../../../../apiCalls/user";

const GlobalSearch = ({ socket }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim() === "") {
        setUsers([]);
        return;
      }
      setLoading(true);
      // API Call here (Uncomment when implemented)
      try {
        const response = await getGlobalSearchFriendsList(searchTerm)
        if (response.status === 200) {
          setUsers(response.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500); // Debounce API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="home-page">
      <Header socket={socket} />
      <div className="main-content">
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ mt: 3, mb: 2 }} color="var(--text-color)">
            Search Users
          </Typography>

          {/* Search Input Component */}
          <SearchUser searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Search Result List Component */}
          <SearchUserList users={users} searchTerm={searchTerm} loading={loading} setUsers={setUsers} />
        </Container>
      </div>
    </div>
  );
};
GlobalSearch.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default GlobalSearch;
