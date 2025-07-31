import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true); // ✅ new state
  const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${apiBaseURL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setUserLoading(false)); // ✅ complete loading
    } else {
      setUser(null);
      setUserLoading(false); // ✅ no token = not logged in
    }
  }, [apiBaseURL]);

  return (
    <UserContext.Provider value={{ user, setUser, userLoading }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
