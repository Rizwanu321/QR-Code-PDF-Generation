import React from "react";
import { Route, Redirect } from "react-router-dom";
import Navigation from "./Navigation";

const ProtectedRoute = ({
  children,
  isAuthenticated,
  setIsAuthenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={({ location }) =>
      isAuthenticated ? (
        <>
          <Navigation setIsAuthenticated={setIsAuthenticated} />
          {children}
        </>
      ) : (
        <Redirect to={{ pathname: "/login", state: { from: location } }} />
      )
    }
  />
);

export default ProtectedRoute;
