import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Button, Alert, Container } from 'react-bootstrap';
import { updateUser, getGroups, getRestaurantsByCity, getCities, getUserById } from '../services/UserService';

import { TreeSelect } from 'antd';
import makeAnimated from 'react-select/animated';
import { useParams } from 'react-router-dom';
import './UpdateUserPage.css';
import { FaTable } from 'react-icons/fa'; // Import table icon
import { FaUsersGear } from "react-icons/fa6";
import { useNavigate, Link,useLocation } from 'react-router-dom';
import Select from 'react-select'; // Importer react-select
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faBars } from '@fortawesome/free-solid-svg-icons'; // Importer l'icône
import { IoMdArrowDropdown } from 'react-icons/io'; // Import arrow dropdown icon
import { AiFillDashboard } from "react-icons/ai";
import { FaUserEdit, FaBars,FaSearch,FaSignOutAlt,FaUsers,FaUserCircle } from "react-icons/fa";
import axios from 'axios'
import { FaArrowLeft } from "react-icons/fa";

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



const { SHOW_PARENT } = TreeSelect;
const animatedComponents = makeAnimated();

const UpdateUserPage = () => {
    const { id } = useParams();
   const [user, setUser] = useState({ email: '', profile_image: '' });
   const [isExpanded, setIsExpanded] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
     const [isLoading, setIsLoading] = useState(true); // Add a loading state
    const [loading, setLoading] = useState(true); // Added loading state

    const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };
  const handleGoBack = () => {
    navigate(-1); // Revenir à la page précédente
  };
    // Fonction pour gérer le clic sur le profil
  const handleProfileClick = () => {
    setShowProfileMenu(prev => !prev);
  };
  // Fonction pour gérer les options du menu de profil
  const handleProfileOptionClick = (option) => {
    if (option === 'logout') {
      // Logique de déconnexion ici
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/'); // Redirige vers la page de connexion ou d'accueil
    } else if (option === 'utilisateur') {
      navigate('/manage'); // Navigue vers la page de gestion
    } else if (option === 'groupes') {
      navigate('/groups'); // Navigue vers la page des groupes
    }
    setShowProfileMenu(false); // Ferme le menu après sélection
  };
   const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };



  const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        is_active: true,
        is_superuser: false,
        is_staff: false,
        group_names: [],
        restaurant_details: [],
    });

    const [groups, setGroups] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [showPopup, setShowPopup] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        number: false,
        specialChar: false,
        letter: false,
    });

    // Fetch user data and populate the form when the component mounts
    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                console.error("L'ID de l'utilisateur est undefined");
                return;
            }

            try {
                const userData = await getUserById(id);
                setFormData({
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    email: userData.email || '',
                    is_active: userData.is_active || true,
                    is_superuser: userData.is_superuser || false,
                    is_staff: userData.is_staff || false,
                    group_names: userData.group_names || [],
                    restaurant_details: userData.restaurant_details || []
                });
                setSelectedValues(userData.restaurant_details.map(res => res.id)); // Assuming `restaurant_details` has an `id` field
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            }
        };

        fetchUser();
    }, [id]);

    // Fetch groups and cities data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupsData, citiesData] = await Promise.all([getGroups(), getCities()]);
                setGroups(groupsData);
                const restaurantsByCity = await Promise.all(citiesData.map(async (city) => {
                    const restaurants = await getRestaurantsByCity(city.name);
                    return {
                        city: city.name,
                        restaurants: restaurants.map(restaurant => ({
                            title: restaurant.name,
                            value: restaurant.id,
                            key: restaurant.id,
                        })),
                    };
                }));

                const treeFormattedData = restaurantsByCity.map(({ city, restaurants }) => ({
                    title: city,
                    value: city,
                    key: city,
                    children: restaurants,
                }));

                setTreeData(treeFormattedData);
            } catch (error) {
                console.error("Échec de la récupération:", error);
            }
        };

        fetchData();
    }, []);

    const onChange = (newValue) => {
        setSelectedValues(newValue);

        const selectedRestaurants = newValue.reduce((acc, value) => {
            const foundCity = treeData.find(item => item.value === value);
            if (foundCity) {
                foundCity.children.forEach(child => acc.push({ id: child.value, name: child.title, city: foundCity.value }));
            } else {
                const foundRestaurant = treeData.flatMap(item => item.children).find(child => child.value === value);
                if (foundRestaurant) {
                    acc.push({ id: foundRestaurant.value, name: foundRestaurant.title, city: '' });
                }
            }
            return acc;
        }, []);

        setFormData(prevData => ({
            ...prevData,
            restaurant_details: selectedRestaurants,
        }));
    };

    const tProps = {
        treeData,
        value: selectedValues,
        onChange,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: 'Sélectionnez un ou plusieurs restaurants',
        style: {
            width: '100%',
            marginBottom: 16,
        },
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Validate password on change
        if (name === 'password') {
            validatePassword(value);
        }
    };

    const validatePassword = (password) => {
        const errors = {
            length: password.length >= 8,
            number: /\d/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            letter: /[a-zA-Z]/.test(password),
        };
        setPasswordErrors(errors);
    };

    const handleGroupChange = (e) => {
        const selectedGroupNames = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData((prevData) => ({
            ...prevData,
            group_names: selectedGroupNames,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { first_name, last_name, email, password, confirmPassword, is_active, is_superuser, is_staff, group_names, restaurant_details } = formData;

        // Check if passwords match
        if (password && password !== confirmPassword) {
            setAlert({ message: "Les mots de passe ne correspondent pas.", type: 'error' });
            setShowPopup(true);
            return;
        }

        const data = {
            first_name,
            last_name,
            email,
            is_active,
            is_superuser,
            is_staff,
            group_names,
            restaurant_details,
            ...(password && { password })
        };

        try {
            await updateUser(id, data);
            setAlert({ message: "Utilisateur mis à jour avec succès", type: 'success' });
            setShowPopup(true);

            // Optionally reset the form after success
            setTimeout(() => setShowPopup(false), 3000); // Hide alert after 3 seconds
        } catch (error) {
            console.error("Échec de la mise à jour de l'utilisateur:", error.response?.data || error.message);
            setAlert({ message: "Échec de la mise à jour de l'utilisateur", type: 'error' });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Hide alert after 3 seconds
        }
    };

    const groupOptions = groups.map(group => ({
        value: group.name,
        label: group.name,
    }));
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
    return (

     <div className="layout-wrapper layout-content-navbar">
    <div className="layout-container">
      {/* Sidebar Component directly included here */}
      <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />

      <div className="layout-page">
        <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">


          <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
            <div className="navbar-nav align-items-center">
              <div className="nav-item navbar-search-wrapper mb-0">
                <button className="nav-item nav-link d-flex align-items-center px-0" onClick={handleGoBack}>
          <FaArrowLeft className="me-2 me-lg-4" />
          <span className="d-none d-md-inline-block text-muted fw-normal">Retour</span>
        </button>
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
                    <a className="dropdown-item mt-0 waves-effect" href="/account">
                      <div className="d-flex align-items-center">
                      {user.profile_image ? (
                            <img
                              src={`http://127.0.0.1:8000${user.profile_image}`}
                              alt="Profile"
                              className="rounded-circle"
                              style={{ width: '40px', height: '40px' }}
                            />
                          ) : (
                        <div className="avatar avatar-online">
                          <FaUserCircle className="rounded-circle" style={{ fontSize: '40px', color: 'black', cursor: 'pointer' }} />
                        </div>
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
                      <span className="align-middle" style={{ color: 'black' }}>Déconnexion</span>
                    </a>
                  </li>
                </ul>
              )}
            </ul>
          </div>
        </nav>
                <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
        <Container className="update-user-page">
            <h3 className="mb-4"><FaUserEdit /> Mettre à jour les informations de l'utilisateur</h3>
            {showPopup && <Alert variant={alert.type}>{alert.message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="first_name">
                            <Form.Label>Prénom :</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le prénom"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="last_name">
                            <Form.Label>Nom :</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="email">
                            <Form.Label>Email :</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Entrez l'email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="password">
                            <Form.Label>Mot de passe :</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Entrez le mot de passe (laisser vide pour ne pas changer)"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <ul>
                            <li style={{ color: passwordErrors.length ? 'green' : 'red' }}>
                                {passwordErrors.length ? '✔' : '✘'} Minimum 8 caractères
                            </li>
                            <li style={{ color: passwordErrors.number ? 'green' : 'red' }}>
                                {passwordErrors.number ? '✔' : '✘'} Doit contenir au moins un chiffre
                            </li>
                            <li style={{ color: passwordErrors.specialChar ? 'green' : 'red' }}>
                                {passwordErrors.specialChar ? '✔' : '✘'} Doit contenir un caractère spécial
                            </li>
                            <li style={{ color: passwordErrors.letter ? 'green' : 'red' }}>
                                {passwordErrors.letter ? '✔' : '✘'} Doit contenir une lettre
                            </li>
                        </ul>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Confirmer le mot de passe :</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirmer le mot de passe"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="is_active">
                            <Form.Check
                                type="checkbox"
                                label="Actif"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>


                </Row>
                <Row>
                    <Col md={12}>
                        <Form.Group controlId="groups">
                            <Form.Label>Groupes :</Form.Label>
                            <Form.Select  onChange={handleGroupChange} value={formData.group_names}>
                                {groupOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Form.Group controlId="restaurants">
                            <Form.Label>Restaurants :</Form.Label>
                            <TreeSelect {...tProps} />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit">Mettre à jour</Button>
            </Form>
        </Container>
        </div>
  </div>
  </div>
  </div>
  </div>
    );
};

export default UpdateUserPage;
