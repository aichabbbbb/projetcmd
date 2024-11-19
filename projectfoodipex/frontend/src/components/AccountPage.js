import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Row, Alert } from 'react-bootstrap';
import { updateUser, getGroups, getRestaurants } from '../services/UserService';
import { FaUserEdit,FaUserCircle, FaBars,FaSearch,FaSignOutAlt,FaUsers } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faBars } from '@fortawesome/free-solid-svg-icons'; // Importer l'icône
import { IoMdArrowDropdown } from 'react-icons/io'; // Import arrow dropdown icon
import { AiFillDashboard } from "react-icons/ai";
import { FaTable } from 'react-icons/fa'; // Import table icon
import { FaUsersGear } from "react-icons/fa6";
import { useNavigate, Link,useLocation } from 'react-router-dom';
import Select from 'react-select'; // Importer react-select
import makeAnimated from 'react-select/animated';




// Composant PopupAlert pour les notifications externes
const PopupAlert = ({ message, type, onClose }) => {
    if (!message) return null;

    return (
        <div className={`popup-alert ${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="close-btn">x</button>
        </div>
    );
};


const AccountPage = (props) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        is_active: true,
        is_superuser: false,
        is_staff: false,
        group_names: [],
     restaurant_names: [] // Utilisez un tableau pour stocker plusieurs restaurants
    });

    const [groups, setGroups] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        number: false,
        specialChar: false,
        letter: false
    });
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [canUpdateUser, setCanUpdateUser] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [showPopup, setShowPopup] = useState(false);

    const { show, user, setUpdated, onHide } = props;

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                is_active: user.is_active || false,
                is_superuser: user.is_superuser || false,
                is_staff: user.is_staff || false,
                group_names: user.group_names || [],
                restaurant_names: user.restaurant_names || []
            });
        }
    }, [user]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupsData, restaurantsData] = await Promise.all([getGroups(), getRestaurants()]);
                setGroups(groupsData);
                setRestaurants(restaurantsData);
            } catch (error) {
                console.error("Échec de la récupération:", error);
            }

            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            setCanUpdateUser(loggedInUser.permissions.some(p => p.codename === 'change_user'));

             };

        fetchData();
    }, []);

    useEffect(() => {
        const { password, confirmPassword } = formData;
        setPasswordErrors({
            length: password ? password.length >= 8 : false,
            number: password ? /\d/.test(password) : false,
            specialChar: password ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : false,
            letter: password ? /[a-zA-Z]/.test(password) : false
        });
        setPasswordMatch(password === confirmPassword);
    }, [formData.password, formData.confirmPassword]);


    const handleGroupChange = (e) => {
        const selectedGroups = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData((prevData) => ({
            ...prevData,
            group_names: selectedGroups,
        }));
    };
     const handleRestaurantChange = (selectedOptions) => {
        const selectedRestaurants = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData((prevData) => ({
            ...prevData,
            restaurant_names: selectedRestaurants,
        }));
    };
         const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password, is_active, is_superuser, is_staff, group_names, restaurant_names } = formData;

        const data = {
            username,
            email,
            is_active,
            is_superuser,
            is_staff,
            group_names,
            restaurant_names,
            ...(password && { password }) // Only include password if provided
        };

        try {
            await updateUser(user.id, data);
            setAlert({ message: "Utilisateur mis à jour avec succès", type: 'success' });
            setShowPopup(true);
            if (setUpdated) setUpdated();
            onHide();
        } catch (error) {
            console.error("Échec de la mise à jour de l'utilisateur:", error.response?.data || error.message);
            setAlert({ message: "Échec de la mise à jour de l'utilisateur", type: 'error' });
            setShowPopup(true);
        }
    };


    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };


    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem('user')));

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const animatedComponents = makeAnimated();

    const toggleSidebar = () => {
      setIsExpanded(prev => !prev);
  };
   const groupOptions = groups.map(group => ({
        value: group.name,
        label: group.name
    }));

    const restaurantOptions = restaurants.map(restaurant => ({
        value: restaurant.name,
        label: restaurant.name
    }));

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

  const closePopup = () => {
        setShowPopup(false);
    };
  //Vérifiez si l'utilisateur appartient au groupe "Administrateur"
    const isAdmin = formData.group_names.includes('Administrateurs');
   if (!user) {
        return null; // Ou affichez un état de chargement
    }

    return (

      <div className="layout-wrapper layout-content-navbar">
    <div className="layout-container">



      <div className="layout-page">

        <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
          <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                          <a
      className="nav-item nav-link px-0 me-xl-4"

      onClick={toggleSidebar}  // Make sure this calls the toggleSidebar function
    >
      <FaBars  class="ti ti-menu-2 ti-md"  style={{ fontSize: '24px', color: 'black', cursor: 'pointer' }} />
    </a>


          </div>

          <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
            <div className="navbar-nav align-items-center">
              <div className="nav-item navbar-search-wrapper mb-0">
                <a className="nav-item nav-link search-toggler d-flex align-items-center px-0" >
                  <FaSearch className="me-2 me-lg-4" />
                  <span className="d-none d-md-inline-block text-muted fw-normal">Search (Ctrl+/)</span>
                </a>
              </div>
            </div>

            <ul className="navbar-nav flex-row align-items-center ms-auto">
              {/* Profile icon */}
              <li className="nav-item">
                <div className="avatar avatar-online">
                  <FaUserCircle
                    className="rounded-circle"
                    style={{ fontSize: '40px', color: 'black', cursor: 'pointer' }}
                    onClick={handleProfileClick}
                  />
                </div>
              </li>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <ul className="dropdown-menu dropdown-menu-end show" data-bs-popper="static" style={{ position: 'absolute', right: '0', top: '60px' }}>
                  <li>
                    <a className="dropdown-item mt-0 waves-effect" href="/account">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-online">
                          <FaUserCircle className="rounded-circle" style={{ fontSize: '40px', color: 'black', cursor: 'pointer' }} />
                        </div>
                        <div className="flex-grow-1">
                          {user.username && user.email && (
                            <>
                              <h6 className="mb-0">{user.username}</h6>
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
    les informations de l'utilisateur
</h2>


{alert.message && (
    <Alert
        variant={alert.type === 'success' ? 'success' : 'danger'}
        style={{
            animation: 'fadeIn 0.5s ease-in-out',
            fontSize: '1.1rem',
            marginBottom: '15px',
            fontWeight: '500',
            padding: '10px 20px',
        }}
    >
        {alert.message}
    </Alert>
)}

<style jsx>{`
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`}</style>

            <Form onSubmit={handleSubmit} className="p-4 border rounded">
             {/* Add UserCircle icon here */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <FaUserCircle style={{ fontSize: '4rem', color: '#7367f0', marginRight: '15px' }} />

            </div>
                <Row>
                    <Col sm={6}>
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Label>Nom d'utilisateur :</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Entrez le nom d'utilisateur"
                                aria-label="Nom d'utilisateur"
                            />
                        </Form.Group>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email :</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Entrez l'email"
                                aria-label="Email"
                            />
                        </Form.Group>
                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Mot de passe :</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Entrez un nouveau mot de passe"
                                aria-label="Mot de passe"
                            />
                            <ul className="mt-2" style={{ listStyleType: 'none', padding: 0 }}>
                                <li style={{ color: passwordErrors.length ? 'green' : 'red' }}>
                                    {passwordErrors.length ? '✔' : '✘'} Minimum 8 caractères
                                </li>
                                <li style={{ color: passwordErrors.number ? 'green' : 'red' }}>
                                    {passwordErrors.number ? '✔' : '✘'} Au moins un chiffre
                                </li>
                                <li style={{ color: passwordErrors.specialChar ? 'green' : 'red' }}>
                                    {passwordErrors.specialChar ? '✔' : '✘'} Un caractère spécial
                                </li>
                                <li style={{ color: passwordErrors.letter ? 'green' : 'red' }}>
                                    {passwordErrors.letter ? '✔' : '✘'} Une lettre
                                </li>
                            </ul>
                        </Form.Group>
                        <Form.Group controlId="confirmPassword" className="mb-3">
                            <Form.Label>Confirmer le mot de passe :</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirmez le nouveau mot de passe"
                                aria-label="Confirmer le mot de passe"
                            />
                            {!passwordMatch && formData.confirmPassword && (
                                <Form.Text className="text-danger">
                                    Les mots de passe ne correspondent pas
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                         <Form.Group controlId="group_names">
                                    <Form.Label>Groupes :</Form.Label>
                                    <Form.Control
                                        as="select"

                                        name="group_names"
                                        value={formData.group_names}
                                        onChange={handleGroupChange}
                                        disabled={!canUpdateUser}
                                    >
                                        {groups.map(group => (
                                            <option key={group.id} value={group.name}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="restaurant_names">
                                    <Form.Label>Restaurants :</Form.Label>
                                    <Select
                                        components={animatedComponents}
                                        isMulti
                                        name="restaurant_names"
                                        options={restaurantOptions}
                                        value={restaurantOptions.filter(option => formData.restaurant_names.includes(option.value))}
                                        onChange={handleRestaurantChange}
                                        isDisabled={isAdmin || !canUpdateUser} // Désactiver si l'utilisateur est Administrateur
                                    />
                                </Form.Group>
                        <Form.Group controlId="is_active" className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="is_active"
                                label="Actif"
                                checked={formData.is_active}
                                onChange={handleChange}
                                aria-label="Utilisateur actif"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit" className="mt-3">Mettre à jour</Button>
            </Form>

             {showPopup && (
                <PopupAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={closePopup}
                />
            )}
        </div>
         </div>
          </div>
           </div>
           </div>
           </div>




    );
};

export default AccountPage;
