import React from 'react';
import './Navbar.css'; // Ensure this file includes styles for the new button
import { FaBars } from 'react-icons/fa';

const Navbar = ({ onSidebarToggle }) => {
  return (
    <div className="navbar1">
      <button className="sidebar-toggle" onClick={onSidebarToggle}>
        <FaBars />
      </button>
      <div className="navbar-logo1">MACDO</div>
      <div className="navbar-links1">
        <a href="/home">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
  );
};

export default Navbar;
