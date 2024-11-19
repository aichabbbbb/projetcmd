import React, { useState, useEffect } from 'react';
import { useNavigate, Link ,useLocation} from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import { FaUsersGear } from "react-icons/fa6";
import {  Navbar } from 'react-bootstrap';
import './App.css';
import { FaBars, FaUserCircle, FaUsers, FaSignOutAlt ,FaTimes} from 'react-icons/fa';
import KpiGraphResto from './KpiGraphResto'; // Import the KpiGraphResto component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faBars } from '@fortawesome/free-solid-svg-icons'; // Importer l'icône
import { IoMdArrowDropdown } from 'react-icons/io'; // Import arrow dropdown icon
import { AiFillDashboard } from "react-icons/ai";
import { FaTable } from 'react-icons/fa'; // Import table icon
import axios from 'axios';


const Sidebar = ({ isExpanded, toggleSidebar }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isFrontPagesOpen, setIsFrontPagesOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboards');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen((prevState) => !prevState);
  };

  const toggleFrontPagesSubMenu = () => {
    setIsFrontPagesOpen((prevState) => !prevState);
  };

  return (
    <aside
      className={`layout-menu menu-vertical menu bg-menu-theme ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{ width: isExpanded ? '250px' : '4.5rem', backgroundColor: isExpanded ? 'inherit' : 'white' }}
    >
      {isExpanded ? (
        // Expanded state
        <>
          <div className="app-brand demo" style={{ marginBottom: '25px' }}>

           <button
              className="layout-menu-toggle menu-link text-large ms-auto"
              onClick={() => toggleSidebar(false)}
              style={{ background: 'none', border: 'none', color: 'black' }}
            >
              <FontAwesomeIcon icon={faTimes} className="fa-toggle d-block align-middle" />
            </button>
          </div>

          <ul className="menu-inner py-1 overflow-auto">
            <li className={`menu-item ${activeMenu === 'dashboards' ? 'active open' : ''}`}>
              <a  className="menu-link menu-toggle" onClick={toggleSubMenu}>
               <AiFillDashboard className="menu-icon"  style={{  fontWeight: 'normal',  color: 'black',   marginRight: '15px' }}/>

                <div className="fw-bold">Dashboards</div>
               <IoMdArrowDropdown
  style={{
    transition: 'transform 0.3s',
    transform: isSubMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    fontSize: '1.5rem' // Increase the size (adjust as needed)
  }}
  className="ms-auto"
/>
              </a>
              {isSubMenuOpen && (
                <ul className="menu-sub" >
                  <li className="menu-item active" >
                    <a className="menu-link" href="/Dashboard" >
                      <div>Analytics</div>
                    </a>
                  </li>
                  <li className="menu-item"  >
                    <a  className="menu-link" href="/manage">
                      <div>CRM</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a  className="menu-link">
                      <div>eCommerce</div>
                    </a>
                  </li>

                </ul>
              )}
            </li>

            <li className={`menu-item ${isFrontPagesOpen ? 'active open' : ''}`}>
              <a  className="menu-link menu-toggle" onClick={toggleFrontPagesSubMenu}>
                <FaTable className="menu-icon"  style={{  fontWeight: 'normal',  color: 'black',   marginRight: '15px' }}/>
                <div className="fw-bold">Front Pages</div>
                <IoMdArrowDropdown
  style={{
    transition: 'transform 0.3s',
    transform: isSubMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    fontSize: '1.5rem' // Increase the size (adjust as needed)
  }}
  className="ms-auto"
/>
              </a>
              {isFrontPagesOpen && (
                <ul className="menu-sub">
                  <li className="menu-item">
                    <a  className="menu-link" target="_blank">
                      <div>Landing</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a className="menu-link" target="_blank">
                      <div>Pricing</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a className="menu-link" target="_blank">
                      <div>Payments</div>
                    </a>
                  </li>

                </ul>
              )}
            </li>
          </ul>
        </>
      ) : (
        // Closed state
        <div className="d-flex flex-column flex-shrink-0" style={{ width: '4.5rem', backgroundColor: 'white' }}>
          <a href="/" className="d-block p-3 link-dark text-decoration-none" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
            <svg className="bi" width="40" height="32"><use xlinkHref="#bootstrap" /></svg>
            <span className="visually-hidden">Icon-only</span>
          </a>
   <button
    className="sidebar-toggle"
    onClick={() => toggleSidebar(true)}
    title="Open Sidebar"
  >
    <FaBars size={24} />
  </button>
          <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeMenu === 'dashboards' ? 'active' : ''} py-3 border-bottom`}
                onClick={() => handleMenuClick('dashboards')}
                title=""
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-original-title="Dashboards"
                style={{
                  backgroundColor: activeMenu === 'dashboards' ? '#c8c8c8' : 'white', // Light gray for active
                  color: 'black', // Ensure icon is black
                }}
              >
                <AiFillDashboard className="bi" width="24" height="24" role="img" aria-label="Dashboard" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === 'frontpages' ? 'active' : ''} py-3 border-bottom`}
                onClick={() => handleMenuClick('frontpages')}
                title=""
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-original-title="Front Pages"
                style={{
                  backgroundColor: activeMenu === 'frontpages' ? '#c8c8c8' : 'white', // Light gray for active
                  color: 'black', // Ensure icon is black
                }}
              >
                <FaTable className="bi" width="24" height="24" role="img" aria-label="Front Pages" />
              </a>
            </li>
            {/* Add other menu items here as needed */}
          </ul>
           <div className="drag-target"
                 style={{
                     touchAction: 'pan-y',
                     userSelect: 'none',
                     WebkitUserDrag: 'none',
                     WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
                 }}>
            </div>
        </div>
      )}


    </aside>
  );
};


// Dashboard Component

const Dashboard = () => {
  const [user, setUser] = useState({ email: '',  profile_image: '' });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData ? userData.id : null;

      if (token && userId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/profile/${userId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            setUser(response.data);
          } else {
            console.error('Failed to fetch user details');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false); // Set loading to false after fetch
        }
      } else {
        console.error('No token or user ID found');
        setLoading(false); // Set loading to false if no token or user ID found
      }
    };
       fetchUser();
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowProfileMenu((prevState) => !prevState);
  };

  const handleProfileOptionClick = (option) => {
    setShowProfileMenu(false);
    if (option === 'logout') {
      handleLogout();
    } else if (option === 'utilisateur') {
      navigate('/manage'); // Redirect to /manage route
    } else if (option === 'groupes') {
      navigate('/groups'); // Redirect to /groups route
    }
  };

  if (loading) return <p>Loading...</p>; // Handle loading state

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />

        <div className="layout-page">
          <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none"></div>

            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
              <div className="navbar-nav align-items-center">
                <div className="nav-item navbar-search-wrapper mb-0">
                  <a className="nav-item nav-link search-toggler d-flex align-items-center px-0">
                    <FaSearch className="me-2 me-lg-4" />
                    <span className="d-none d-md-inline-block text-muted fw-normal">Search (Ctrl+/)</span>
                  </a>
                </div>
              </div>

              <ul className="navbar-nav flex-row align-items-center ms-auto">
                {/* Profile icon */}
                <li className="nav-item">
                  <div className="avatar avatar-online">
                    {user.profile_image ? (
                      <img
                        src={`http://127.0.0.1:8000${user.profile_image}`} // Assuming the profile_image is a relative URL
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                        onClick={handleProfileClick}
                      />
                    ) : (
                      <FaUserCircle
                        className="rounded-circle"
                        style={{ fontSize: '40px', color: 'black', cursor: 'pointer' }}
                        onClick={handleProfileClick}
                      />
                    )}
                  </div>
                </li>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <ul className="dropdown-menu dropdown-menu-end show" data-bs-popper="static" style={{ position: 'absolute', right: '0', top: '60px' }}>
                    <li>
                      <a className="dropdown-item mt-0 waves-effect" href="/profile">
                        <div className="d-flex align-items-center">
                          {user.profile_image ? (
                            <img
                              src={`http://127.0.0.1:8000${user.profile_image}`}
                              alt="Profile"
                              className="rounded-circle"
                              style={{ width: '40px', height: '40px' }}
                            />
                          ) : (
                            <FaUserCircle
                              className="rounded-circle"
                              style={{ fontSize: '40px', color: 'black' }}
                            />
                          )}
                          <div className="flex-grow-1">
                            {user.email && (
                              <>

                                <small className="text-muted">{user.email}</small>
                              </>
                            )}
                          </div>
                        </div>
                      </a>
                    </li>

                    <li>
                      <div className="dropdown-divider my-1 mx-n2"></div>
                    </li>

                    <li>
                      <a className="dropdown-item waves-effect" href="/manage">
                        <FaUsersGear className="me-3" style={{ fontSize: '20px', color: 'black', cursor: 'pointer' }} />
                        <span className="align-middle" style={{ color: 'black' }}>Utilisateurs</span>
                      </a>
                    </li>

                    <li>
                      <a className="dropdown-item waves-effect" href="/groups">
                        <FaUsers className="me-3" style={{ fontSize: '20px', color: 'black', cursor: 'pointer' }} />
                        <span className="align-middle" style={{ color: 'black' }}>Groupes</span>
                      </a>
                    </li>

                    <li>
                      <div className="dropdown-divider my-1 mx-n2"></div>
                    </li>

                    <li>
                      <a className="dropdown-item waves-effect" href="/logout" onClick={handleLogout}>
                        <FaSignOutAlt className="me-3" style={{ fontSize: '20px', color: 'red', cursor: 'pointer' }} />
                        <span className="align-middle" style={{ color: 'black' }}>Deconnexion</span>
                      </a>
                    </li>
                  </ul>
                )}
              </ul>
            </div>
          </nav>

          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row g-6">
                <KpiGraphResto />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;