import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

  // Fetch user from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${apiBaseURL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [apiBaseURL]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ PropTypes to fix ESLint error
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
