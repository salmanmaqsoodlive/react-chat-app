import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const withAuthentication = (WrappedComponent) => {
  return function AuthComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }, []);

    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    } else {
      return <Navigate to="/login" />;
    }
  };
};

export default withAuthentication;
