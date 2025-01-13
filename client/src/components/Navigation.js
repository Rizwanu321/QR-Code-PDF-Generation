import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const Navigation = ({ setIsAuthenticated, setUser, user }) => {
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUser(null);
      history.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/dashboard" className="hover:text-blue-200">
            Dashboard
          </Link>
          <Link to="/settings" className="hover:text-blue-200">
            Settings
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
