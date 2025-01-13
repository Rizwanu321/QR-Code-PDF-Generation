import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import axios from "axios";

import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "https://qr-code-pdf-generation-server.onrender.com/api/auth/check",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(response.data.authenticated);
        if (response.data.authenticated) {
          setUser(response.data.user);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          {isAuthenticated ? (
            <Redirect to="/dashboard" />
          ) : (
            <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          )}
        </Route>

        <ProtectedRoute
          exact
          path="/dashboard"
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
          user={user}
        >
          <Dashboard user={user} />
        </ProtectedRoute>

        <ProtectedRoute
          exact
          path="/settings"
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
          user={user}
        >
          <Settings user={user} />
        </ProtectedRoute>

        <Route path="/">
          <Redirect to={isAuthenticated ? "/dashboard" : "/login"} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
