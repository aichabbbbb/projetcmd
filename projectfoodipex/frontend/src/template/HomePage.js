import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';
import { FaBars, FaUser, FaUsers, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import photo11 from '../static/photo11.jpeg';
import photo2 from '../static/photo2.jpeg';
import photo3 from '../static/photo3.jpeg';
import Carousel from 'react-bootstrap/Carousel';
import home from '../static/home.jpg'; // Make sure this path is correct

const HomePage = () => {

    const [sidebarMenuVisible, setSidebarMenuVisible] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [user, setUser] = useState({ email: '', username: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('user'));
            const userId = userData ? userData.id : null;

            if (token && userId) {
                const response = await fetch(`http://127.0.0.1:8000/users/${userId}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const userDetails = await response.json();
                    setUser(userDetails);
                } else {
                    console.error('Failed to fetch user details');
                }
            } else {
                console.error('No token or user ID found');
            }
        };

        fetchUser();
    }, []);

    const handleSidebarToggle = () => {
        setSidebarMenuVisible(prev => !prev);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleProfileClick = () => {
        setShowProfileMenu(prevState => !prevState);
    };

    const handleProfileOptionClick = (option) => {
        setShowProfileMenu(false);
        if (option === 'logout') {
            handleLogout();
        }
    };

    return (
        <div className="home-page-container">
            <div className={`sidebar { 'sidebar-visible' : 'sidebar-hidden'}`}>
                <button className="sidebar-toggle" onClick={handleSidebarToggle}>
                    <FaBars />
                </button>
                <div className={`sidebar-menu ${sidebarMenuVisible ? 'menu-visible' : 'menu-hidden'}`}>


                    <Link to="/manage"><FaUsers /> Manage Users</Link>
                      <Link to="/groups"><FaUsers /> Groups</Link>
                </div>
            </div>
            <div className="main-content">
                <nav className="navbar2">
                    <div className="navbar-left">
                        <img src={home} alt="Logo" className="logo" />
                        <span className="navbar-title">Home</span>
                    </div>
                    <div className="profile-menu-container">
                        <button className="profile-button" onClick={handleProfileClick}>
                            <FaUserCircle />
                        </button>
                        {user.username && user.email && (
                            <span className="user-info">
                                {user.username} <span className="email">{user.email}</span>
                            </span>
                        )}
                        {showProfileMenu && (
                            <div className="profile-menu">
                                <button onClick={() => handleProfileOptionClick('logout')} className="logout-button">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
                <div className="content-wrapper">
                    <div className="carousel-container">
                        <Carousel variant="dark" controls={true} indicators={true} interval={3000}>
                            <Carousel.Item>
                                <img src={photo2} alt="First slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={photo11} alt="Second slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={photo3} alt="Third slide" />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
