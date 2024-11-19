import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserEdit, FaBars,FaSearch,FaSignOutAlt,FaUsers } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faBars } from '@fortawesome/free-solid-svg-icons'; // Importer l'icône
import { IoMdArrowDropdown } from 'react-icons/io'; // Import arrow dropdown icon
import { AiFillDashboard } from "react-icons/ai";
import { FaTable } from 'react-icons/fa'; // Import table icon
import { FaUsersGear } from "react-icons/fa6";
import { useNavigate, Link,useLocation } from 'react-router-dom';
import Select from 'react-select'; // Importer react-select
import makeAnimated from 'react-select/animated';
import { FaArrowLeft } from "react-icons/fa";
import { FaPlusCircle } from 'react-icons/fa';




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



const ProfilePage = () => {
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [user, setUser] = useState({ email: '', profile_image: '' });
    const [profileData, setProfileData] = useState({

        email: '',
        first_name: '',
        last_name: '',
        restaurants: [],
        profile_image: null,
        groups: [],
    });
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);


    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        number: false,
        specialChar: false,
        letter: false,
        match: true
    });
    const [formErrors, setFormErrors] = useState({});
        const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);


    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const animatedComponents = makeAnimated();

    const toggleSidebar = () => {
      setIsExpanded(prev => !prev);
  };
        // Fonction pour gérer le clic sur le profil
  const handleProfileClick = () => {
    setShowProfileMenu(prev => !prev);
  };
     const handleGoBack = () => {
    navigate(-1); // Revenir à la page précédente
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


    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/profile/${loggedInUser.id}/`)
            .then(response => {
                console.log('Fetched profile data:', response.data);
                setProfileData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
                setError('Échec de la récupération des données du profil');
                setLoading(false);
            });
    }, [loggedInUser.id]);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setNewProfilePicture(file);

    if (file) {
        // Create a preview URL and set it in state
        const previewUrl = URL.createObjectURL(file);
        setProfilePicturePreview(previewUrl);
    } else {
        setProfilePicturePreview(null); // Reset if no file is selected
    }
    console.log('Selected new profile picture:', file);
};


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }
        validatePassword(value, name);
    };

    const validatePassword = (value, fieldName) => {
        const length = value.length >= 8;
        const number = /\d/.test(value);
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const letter = /[a-zA-Z]/.test(value);
        const match = newPassword === confirmPassword;

        if (fieldName === 'newPassword') {
            setPasswordErrors({
                length,
                number,
                specialChar,
                letter,
                match
            });
        } else {
            setPasswordErrors(prev => ({
                ...prev,
                match
            }));
        }
    };

    const validateForm = async () => {
        const errors = {};

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(profileData.email)) {
            errors.email = "Format d'email invalide.";
        }






        // Check if email already exists (skip if it's the logged-in user's email)

if (profileData.email !== loggedInUser.email) {
    try {
        const emailResponse = await axios.get(`http://127.0.0.1:8000/api/profile/?email=${profileData.email}`);

        // Si un utilisateur avec cet email exact existe déjà, générer une erreur
        if (emailResponse.data.length > 0) {
            const exactMatch = emailResponse.data.some(user => user.email === profileData.email);

            if (exactMatch) {
                errors.emailExists = "L'email exact existe déjà.";
            }
        }
    } catch (error) {
        console.error('Error checking email:', error);
    }
}


        // Check if passwords match
        if (newPassword && newPassword !== confirmPassword) {
            errors.password = "Les mots de passe ne correspondent pas.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Return true if no errors
    };

    const updateProfile = async (formData) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/profile/${loggedInUser.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log('Profile updated successfully:', response.data);
            setProfileData({
                ...profileData,
                ...response.data,
            });
            alert('Profil mis à jour avec succès !');
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Échec de la mise à jour du profil');
        }
    };

    const updatePassword = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/profile/${loggedInUser.id}/`, {
                new_password: newPassword,
            });
            alert('Mot de passe mis à jour avec succès !');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
            setError('Échec de la mise à jour du mot de passe');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValid = await validateForm();
        if (!isValid) {
            setError('Veuillez corriger les erreurs ci-dessus.');
            return; // Stop submission if there are validation errors
        }

        const formData = new FormData();
        if (newProfilePicture) {
            formData.append('profile_picture', newProfilePicture);
        }

        formData.append('email', profileData.email);
        formData.append('first_name', profileData.first_name);
        formData.append('last_name', profileData.last_name);

        // Update the profile first
        await updateProfile(formData);

        // Change password if needed
        if (newPassword) {
            await updatePassword();
        }
    };

    if (loading) return <p>Loading...</p>;

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
            <div className="container mt-4">
              <h2 style={{
                fontSize: '25px', // Augmente la taille de la police
                fontWeight: 'bold',
                color: '#333', // Couleur du texte légèrement plus foncée
                display: 'flex',
                alignItems: 'center',
                marginBottom: '30px', // Plus d'espace en bas
                padding: '10px 15px', // Ajout d'un peu de padding
                backgroundColor: '#f0f0f0', // Couleur de fond légère
                borderRadius: '5px', // Coins arrondis
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Légère ombre
                transition: 'transform 0.2s', // Ajout d'une transition pour les interactions
                ':hover': {
                  transform: 'scale(1.02)', // Agrandissement au survol
                },
              }}>
                <FaUserEdit style={{
                  marginRight: '10px',
                  color: '#7367f0',
                  fontSize: '1.5rem'
                }} />
                Les informations de l'utilisateur
              </h2>

              <div className="container mt-5">

                {error && <Alert variant="danger">{error}</Alert>}
               <div>
    <label>Photo de Profil: </label>
    <div style={{ display: 'flex', alignItems: 'center' }}>
        {profilePicturePreview ? (
           <div style={{ position: 'relative', marginRight: '10px' }}>
            <img
                src={profilePicturePreview} // Use the preview URL
                alt="Profile Preview"
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '2px solid #ccc',
                    objectFit: 'cover',
                    marginRight: '10px'
                }}
            />
             <label style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            cursor: 'pointer',
                          }}>
                            <FaPlusCircle
                              size="30"
                              style={{
                                position: 'absolute',
                                bottom: '5px',
                                right: '5px',
                                color: '#007bff',
                                cursor: 'pointer',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                              }}
                            />
                            <input type="file" onChange={handleProfilePictureChange} style={{ display: 'none' }} />
                          </label>
                        </div>
        ) : profileData.profile_image ? (
           <div style={{ position: 'relative', marginRight: '10px' }}>
            <img
                src={`http://127.0.0.1:8000${profileData.profile_image}`}
                alt="Profile"
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '2px solid #ccc',
                    objectFit: 'cover',
                    marginRight: '10px'
                }}
            />
             <label style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            cursor: 'pointer',
                          }}>
                            <FaPlusCircle
                              size="30"
                              style={{
                                position: 'absolute',
                                bottom: '5px',
                                right: '5px',
                                color: '#007bff',
                                cursor: 'pointer',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                              }}
                            />
                            <input type="file" onChange={handleProfilePictureChange} style={{ display: 'none' }} />
                          </label>
                        </div>
        ) : (
         <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <FaUserCircle size="100" style={{ color: '#ccc' }} />
                               <label style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            cursor: 'pointer',
                          }}>
                            <FaPlusCircle
                                size="30"
                                style={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    right: '5px',
                                    color: '#007bff',
                                    cursor: 'pointer',
                                    backgroundColor: '#fff',
                                    borderRadius: '50%',
                                }}
                            />
                            <input type="file" onChange={handleProfilePictureChange} style={{ display: 'none' }} />
                          </label>

                        </div>
        )}

    </div>
</div>


                <Form onSubmit={handleSubmit} className="mt-4">


                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && <Form.Text className="text-danger">{formErrors.email}</Form.Text>}
                    {formErrors.emailExists && <Form.Text className="text-danger">{formErrors.emailExists}</Form.Text>}
                  </Form.Group>

                  <Form.Group controlId="formFirstName">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formLastName">
                    <Form.Label>Nom de famille</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formNewPassword">
                    <Form.Label>Nouveau mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={newPassword}
                      onChange={handlePasswordChange}
                    />
                    <ul>
                      <li style={{ color: passwordErrors.length ? 'green' : 'red' }}>
                        {passwordErrors.length ? '✔' : '✘'} Minimum 8 caractères
                      </li>
                      <li style={{ color: passwordErrors.number ? 'green' : 'red' }}>
                        {passwordErrors.number ? '✔' : '✘'} Au moins un chiffre
                      </li>
                      <li style={{ color: passwordErrors.specialChar ? 'green' : 'red' }}>
                        {passwordErrors.specialChar ? '✔' : '✘'} Au moins un caractère spécial
                      </li>
                      <li style={{ color: passwordErrors.letter ? 'green' : 'red' }}>
                        {passwordErrors.letter ? '✔' : '✘'} Au moins une lettre
                      </li>
                    </ul>
                  </Form.Group>

                  <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    {!passwordErrors.match && confirmPassword && (
                      <Form.Text className="text-danger">
                        Les mots de passe ne correspondent pas
                      </Form.Text>
                    )}
                  </Form.Group>

                  {formErrors.password && <Form.Text className="text-danger">{formErrors.password}</Form.Text>}

                  <Button variant="primary" type="submit">Mettre à jour le profil</Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default ProfilePage;
