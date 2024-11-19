import React from 'react';
import { FaBars } from 'react-icons/fa';

import { Link  } from 'react-router-dom';
const Sidebar = ({ showSidebar, onClose, onToggle, menuVisible }) => {
    return (
        <div className={`sidebar ${showSidebar ? 'sidebar-visible' : 'sidebar-hidden'}`}>
            <button className="sidebar-toggle" onClick={onToggle}>
                <FaBars />
            </button>
            {/* Sidebar content */}
            <div className={`sidebar-menu ${menuVisible ? 'menu-visible' : 'menu-hidden'}`}>
                {/* Add your sidebar menu items here */}
               <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/users">Users</Link></li>
                     <li><Link to="/manage">Manage Users</Link></li>
                     <li><Link to="/groups">Groups</Link></li>


                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
