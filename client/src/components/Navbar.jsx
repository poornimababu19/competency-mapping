import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Access user and logout from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout function to clear auth state
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">Competency Mapping</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span>Welcome, {user.name}</span> {/* Display user name */}
            <button onClick={handleLogout} className="text-white">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
