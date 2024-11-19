import React, { useEffect, useState } from 'react';
import { Table, Button, Container, FormControl, Navbar, Nav } from 'react-bootstrap';
import { FaEdit, FaSearch, FaUserPlus, FaBars, FaTimes, FaArrowLeft, FaSignOutAlt, FaUserCircle, FaUsers } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiDeleteBin5Line } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddUserPage from './AddUserPage';
import UpdateUserPage   from './UpdateUserPage';

import { getUsers, deleteUser ,getRestaurants } from '../services/UserService';
import './Manage.css';
import { FaUsersGear } from "react-icons/fa6";
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faBars } from '@fortawesome/free-solid-svg-icons'; // Importer l'icône
import { IoMdArrowDropdown } from 'react-icons/io'; // Import arrow dropdown icon
import { AiFillDashboard } from "react-icons/ai";
import { FaTable } from 'react-icons/fa'; // Import table icon

// Sidebar component
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
                  <li className="menu-item " >
                    <a className="menu-link"  href="/Dashboard">
                      <div>Analytics</div>
                    </a>
                  </li>
                  <li className="menu-item "  >
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

//Manage
const Manage = () => {
     const [user1, setUser] = useState({ email: '',  profile_image: '' });
  const [addModalShow, setAddModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const location = useLocation();
  const [restaurants, setRestaurants] = useState([]); // State for restaurants
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Currently selected restaurant
  const [loggedInUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [canAddUser, setCanAddUser] = useState(false);
  const [canChangeUser, setCanChangeUser] = useState(false);
  const [canDeleteUser, setCanDeleteUser] = useState(false);
  const [canViewUser, setCanViewUser] = useState(false);
  const [canExecuteUser, setCanExecuteUser] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Sidebar initially closed
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
    const [loading, setLoading] = useState(true); // Added loading state
      const [users, setUsers] = useState([]);
const [updated, setUpdated] = useState(false);
  const user = loggedInUser || {}; // Define user
  const navigate = useNavigate(); // Define navigate

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };
  const handleGoBack = () => {
    navigate(-1); // Revenir à la page précédente
  };



const fetchUsers = async () => {
  try {
    console.log(loggedInUser); // Vérifiez le contenu de loggedInUser
    const data = await getUsers();

    // Vérifiez si loggedInUser.groups est bien défini et est un tableau
    const isAdmin = Array.isArray(loggedInUser.groups) && loggedInUser.groups.includes('Administrateurs');
    console.log(`Is Admin: ${isAdmin}`); // Vérifiez le statut d'administrateur

    // Logique pour définir les utilisateurs affichés
    if (isAdmin) {
      setUsers(data); // Si admin, montrer tous les utilisateurs
      setFilteredUsers(data); // Mettre à jour filteredUsers avec tous les utilisateurs
    } else {
      const filtered = data.filter(u => u.id === loggedInUser.id);
      setUsers(filtered); // Ne définir que l'utilisateur connecté
      setFilteredUsers(filtered); // Mettre à jour filteredUsers avec l'utilisateur connecté
    }
  } catch (error) {
    console.error("Failed to fetch users", error);
  } finally {
    setIsLoading(false); // Assurez-vous que le chargement est faux après récupération
  }
};


    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            const userId = user.id;

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
                }
            } else {
                console.error('No token or user ID found');
            }
        };
        fetchUser();
    }, [user.id]);

    // Check permissions and set loading state
    useEffect(() => {
        const checkPermissions = () => {
            const userPermissions = loggedInUser.permissions || [];
            setCanAddUser(userPermissions.some(permission => permission.codename === 'add_user'));
            setCanChangeUser(userPermissions.some(permission => permission.codename === 'change_user'));
            setCanDeleteUser(userPermissions.some(permission => permission.codename === 'delete_user'));
            setCanViewUser(userPermissions.some(permission => permission.codename === 'view_user'));
            setIsLoading(false);
        };
        checkPermissions();
    }, [loggedInUser]);

    // Redirect if user does not have permission to view users
    useEffect(() => {
        if (!canViewUser && !isLoading) {
            alert("Vous n'avez pas la permission d'accéder à cette page.");
            navigate('/dashboard'); // Redirect to home page
        }
    }, [canViewUser, isLoading, navigate]);

    // Fetch users based on permissions
    useEffect(() => {
        if (!isLoading && canViewUser) {
            fetchUsers();
        }
    }, [isLoading, canViewUser]);

    // Search logic - updates filtered users based on searchQuery
    useEffect(() => {
        const results = users.filter(user =>
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.group_names && user.group_names.join(' ').toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredUsers(results);
    }, [searchQuery, users]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAdd = () => {
        navigate('/ajouter');
    };

    const handleUpdate = (user) => {
        navigate(`/modifier/${user.id}`);
    };

    const handleDelete = async (id) => {
        const userToDelete = users.find(user => user.id === id);
        const isAdmin = userToDelete.group_names.includes('Administrateurs');

        if (isAdmin) {
            alert("Vous ne pouvez pas supprimer un utilisateur Administrateur.");
            return;
        }

        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            try {
                await deleteUser(id);
                alert("Utilisateur supprimé avec succès");
                fetchUsers(); // Call fetchUsers to refresh user list after deletion
            } catch (error) {
                alert("Échec de la suppression de l'utilisateur");
            }
        }
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

    const fetchRestaurants = async () => {
        try {
            const data = await getRestaurants();
            setRestaurants(data);
            if (data.length > 0) {
                setSelectedRestaurant(data[0].id); // Default to the first restaurant
            }
        } catch (error) {
            console.error("Failed to fetch restaurants", error);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);


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
                                     {user1.profile_image ? (
                      <img
                        src={`http://127.0.0.1:8000${user1.profile_image}`} // Assuming the profile_image is a relative URL
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
                                                {user1.profile_image ? (
                            <img
                              src={`http://127.0.0.1:8000${user1.profile_image}`}
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
                                                        { user.email && (
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

               <div className="content">
        <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">

              {canAddUser && (
               <Button onClick={handleAdd} variant="secondary" className="me-2">
  <FaUserPlus className="me-1" /> {/* Adding margin with Bootstrap's `me-1` class */}
  Ajouter Utilisateur
</Button>

              )}

       <div className="search-container d-flex align-items-center" style={{ marginRight: '20px', marginBottom: '5px', marginTop: '4px' }}>
  <FaSearch className="search-icon" style={{ marginRight: '8px' }} />
  <FormControl
    type="text"
    placeholder="cherche par nom,email, ou groupe"
    value={searchQuery}
    onChange={handleSearchChange}
    className="search-input"
    style={{ height: '40px', width: '200px', paddingLeft: '30px' }} // Adjust padding as needed
  />
</div>




            </div>
        </div>
            <div className="table-container">
                <Table className='table1'>
                <thead>
                  <tr>

                    <th>Email</th>
                    <th>Actif</th>
                    <th>Groupes</th>
                    <th>Restaurants</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.id}>

                        <td>{user.email}</td>
                        <td>
                          <span >
                            {user.is_active ? 'oui' : 'Non'}
                          </span>
                        </td>
                        <td>{user.group_names.length > 0 ? user.group_names.join(', ') : ''}</td>
           <td >
            {Array.isArray(user.restaurant_names) && user.restaurant_names.length > 0 ? (
              <ul style={{ paddingLeft: '0', margin: '0', listStyleType: 'none' }}>
                {user.restaurant_names.map((restaurant, index) => (
                  <li key={index} style={{ marginBottom: '5px', color: '#333', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginLeft: '10px' }}>{restaurant}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span></span>
            )}
          </td>
                        <td>
                          {canChangeUser && (
                       <Button onClick={() => handleUpdate(user)} variant="outline-primary" className="me-2 black-button">
  <FaEdit />
</Button>
   )}
{canDeleteUser && (
  <Button onClick={() => handleDelete(user.id)} variant="outline-danger" className="black-button">
    <RiDeleteBin5Line />
  </Button>
)}

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">Aucun utilisateur trouvé</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>



        </div>
      </div>
      </div>
       </div>
        </div>
         </div>
  );
};

export default Manage;
