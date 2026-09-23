import React from "react";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#f4f4f4', marginBottom: '20px' }}>
      <h3>Admin Dashboard</h3>
      <button onClick={handleLogout} style={{ padding: '5px 15px', cursor: 'pointer' }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;