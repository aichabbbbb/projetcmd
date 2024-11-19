import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link,useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash,FaSearch,FaUserPlus, FaUsers, FaCheckSquare, FaSquare, FaPlus, FaArrowLeft,FaKey,FaEdit,FaBars,FaTimes,FaSignOutAlt, FaUserCircle} from 'react-icons/fa';
import {Modal,Button,Navbar,Nav,Form,FormControl,Container,Table,Dropdown,} from 'react-bootstrap';
import './Manage.css';
import { GrUserAdmin } from "react-icons/gr";
import { MdSaveAlt } from "react-icons/md";
import { MdSelectAll,MdDeselect  } from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faBars } from '@fortawesome/free-solid-svg-icons'; // Importer l'icône
import { IoMdArrowDropdown } from 'react-icons/io'; // Import arrow dropdown icon
import { AiFillDashboard } from "react-icons/ai";
import { FaTable } from 'react-icons/fa'; // Import table icon
import { MdEdit } from "react-icons/md"; // Import edit icon for better UX


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
// Composant PopupAlert pour les notifications externes
const PopupAlert = ({ message, type, onClose }) => {
    if (!message) return null; // Ne rien afficher s'il n'y a pas de message

    return (
        <div className={`popup-alert ${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="close-btn">x</button>
        </div>
    );
};

function GroupPermissions() {
  const { id } = useParams();
  const [permissions, setPermissions] = useState({});
  const [newPermissionName, setNewPermissionName] = useState('');
  const [appLabel, setAppLabel] = useState('');
  const [model, setModel] = useState('');
  const [codename, setCodename] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allSelected, setAllSelected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [updatePermissionName, setUpdatePermissionName] = useState('');
  const [updateAppLabel, setUpdateAppLabel] = useState('');
    const [newGroupName, setNewGroupName] = useState(''); // State for new group name
    const [showCreateModal, setShowCreateModal] = useState(false);
const [loadingCreate, setLoadingCreate] = useState(false);

    const [updatedGroupName, setUpdatedGroupName] = useState('');
   const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
      const [alert, setAlert] = useState({ message: '', type: '' });
       const [user1, setUser] = useState({ email: '', profile_image: '' });
       const [loading, setLoading] = useState(true); // Added loading state

  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
   const [showProfileMenu, setShowProfileMenu] = useState(false);
      const [loggedInUser] = useState(JSON.parse(localStorage.getItem('user')));
    const user = loggedInUser || {}; // Définit user

    const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };
   useEffect(() => {
    fetchGroupName();
  }, []);
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



    const updateGroupName = async () => {
        if (!updatedGroupName) return;

        try {
            await axios.put(`http://127.0.0.1:8000/api/groups/${id}/`, { name: updatedGroupName });
            setGroupName(updatedGroupName); // Met à jour le nom du groupe
            setUpdatedGroupName(''); // Réinitialiser le champ d'entrée
            setAlert({ message: 'Nom du groupe mis à jour avec succès', type: 'success' });
            setPopupMessage('Nom du groupe mis à jour avec succès'); // Message de confirmation
            setShowPopup(true); // Afficher le popup
            setShowUpdateModal(false); // Ferme le modal après mise à jour réussie
        } catch (error) {
            console.error('Il y a eu une erreur lors de la mise à jour du nom du groupe!', error);
            setAlert({ message: 'Erreur lors de la mise à jour du nom du groupe', type: 'danger' });
            setPopupMessage('Erreur lors de la mise à jour du nom du groupe'); // Message d'erreur
            setShowPopup(true); // Afficher le popup
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

  useEffect(() => {
    fetchPermissions();
    checkIfAdministrator();
    fetchGroupName();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/groups/${id}/permissions/`
      );
      const perms = response.data;
      const groupedPermissions = perms.reduce((acc, perm) => {
        const model = perm.model;
        if (!acc[model]) {
          acc[model] = {
            model: model,
            permissions: {}
          };
        }
        acc[model].permissions[perm.codename] = perm;
        return acc;
      }, {});
      setPermissions(groupedPermissions);
    } catch (error) {
      console.error('There was an error fetching the permissions!', error);
    }
  };

  const fetchGroupName = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/groups/');
      const groups = response.data;
      const group = groups.find((g) => g.id === parseInt(id, 10));
      if (group) {
        setGroupName(group.name);
      } else {
        console.error('Group not found');
      }
    } catch (error) {
      console.error('There was an error fetching the group name!', error);
    }
  };

  const checkIfAdministrator = () => {
  const userGroup = JSON.parse(localStorage.getItem('user'));
  console.log('User Group:', userGroup);  // Ajout du log pour vérifier le contenu du groupe utilisateur

  if (userGroup && userGroup.groups.includes('Administrateurs')) {
    setIsAdmin(true);
    console.log('User is an administrator');  // Ajout du log pour confirmer si l'utilisateur est administrateur
  } else {
    console.log('User is not an administrator');  // Log pour le cas où l'utilisateur n'est pas administrateur
  }
};


  const handlePermissionChange = (model, codename, isChecked) => {
      if (Object.keys(initialPermissions).length === 0) {
      setInitialPermissions(JSON.parse(JSON.stringify(permissions))); // Sauvegarder l'état initial avant toute modification
    }
    if (isAdmin && groupName === 'Administrateurs') return;

    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [model]: {
        ...prevPermissions[model],
        permissions: {
          ...prevPermissions[model].permissions,
          [codename]: {
            ...prevPermissions[model].permissions[codename],
            is_active: isChecked
          }
        }
      }
    }));
  };



  const deletePermission = async (model, codename) => {
    try {
      const permissionId = permissions[model].permissions[codename].id;
      await axios.delete(
        `http://127.0.0.1:8000/groups/${id}/permissions/${permissionId}/`
      );
      setPermissions((prevPermissions) => {
        const newPermissions = { ...prevPermissions };
        delete newPermissions[model].permissions[codename];
        return newPermissions;
      });
    } catch (error) {
      console.error('There was an error deleting the permission!', error);
    }
  };

  const savePermissions = async () => {
    try {
      const updatedPermissions = Object.keys(permissions).flatMap((model) =>
        Object.values(permissions[model].permissions).map((permission) => ({
          id: permission.id,
          is_active: permission.is_active,
        }))
      );
      await axios.put(
        `http://127.0.0.1:8000/groups/${id}/permissions/`,
        updatedPermissions
      );

       setAlert({ message: 'Permission changer avec succès', type: 'success' });
        setPopupMessage('Permission changer avec succès'); // Set the message
        setShowPopup(true); // Show the popup
    } catch (error) {
      console.error('There was an error updating the permissions!', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const areAllSelected = Object.values(permissions).every((model) =>
      Object.values(model.permissions).every((permission) => permission.is_active)
    );
    setAllSelected(areAllSelected);
  }, [permissions]);

  const handleToggleSelect = () => {
    if (isAdmin && groupName === 'Administrateurs') return;
    setPermissions((prevPermissions) => {
      const newPermissions = { ...prevPermissions };
      Object.keys(newPermissions).forEach((model) => {
        Object.keys(newPermissions[model].permissions).forEach((codename) => {
          newPermissions[model].permissions[codename].is_active = !allSelected;
        });
      });
      return newPermissions;
    });
  };

  const isActive = (path) => {
    return window.location.pathname === path ? 'active' : '';
  };




   const closePopup = () => {
    setShowPopup(false); // Hide the popup
    setPopupMessage(''); // Clear the message if needed
};
 const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };
  // State to manage "Select All" for each permission type
  const [selectAll, setSelectAll] = useState({
    add: false,
    change: false,
    delete: false,
    view: false,
    execute: false,
  });

  // Function to handle changes for "Select All"
  const handleSelectAllChange = (permissionType) => {
    const newValue = !selectAll[permissionType];
    setSelectAll((prev) => ({ ...prev, [permissionType]: newValue }));

    // Update all checkboxes for this permission type
    Object.keys(permissions)
      .filter((model) => ['group', 'user', 'permission'].includes(model.toLowerCase()))
      .forEach((model) => {
        handlePermissionChange(model, `${permissionType}_${model}`, newValue);
      });
  };

const [initialPermissions, setInitialPermissions] = useState({}); // Sauvegarde de l'état initial
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  // Fonction pour gérer l'ouverture du modal de confirmation
  const handleSaveClick = () => {
    setShowConfirmModal(true); // Ouvrir le modal
  };

  // Fonction pour gérer la confirmation de sauvegarde
  const handleConfirmSave = async () => {
    setShowConfirmModal(false); // Fermer la modal

    try {
      const updatedPermissions = Object.keys(permissions).flatMap((model) =>
        Object.values(permissions[model].permissions).map((permission) => ({
          id: permission.id,
          is_active: permission.is_active,
        }))
      );

      await axios.put(
        `http://127.0.0.1:8000/groups/${id}/permissions/`,
        updatedPermissions
      );

      // Réinitialiser les permissions initiales après sauvegarde réussie
      setInitialPermissions({});

      // Message de succès
      setAlert({ message: 'Permissions modifiées avec succès', type: 'success' });
      setPopupMessage('Permissions modifiées avec succès');
      setShowPopup(true);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des permissions', error);
    }
  };

  // Fonction pour gérer l'annulation des modifications
  const handleCancel = () => {
    setPermissions(initialPermissions); // Restaurer l'état initial
    setInitialPermissions({}); // Réinitialiser les permissions initiales
    setShowConfirmModal(false); // Fermer le modal
  };
  const createGroup = async () => {
  if (!newGroupName) return;

  setLoadingCreate(true); // Set loading to true while creating
  try {
    const response = await axios.post(`http://127.0.0.1:8000/api/groups/`, {
      name: newGroupName,
    });

    if (response.status === 201) {
      setGroupName(newGroupName); // Optionally set the newly created group's name
      setNewGroupName(''); // Reset the input
      setAlert({ message: 'Groupe créé avec succès', type: 'success' });
      setPopupMessage('Groupe créé avec succès');
      setShowPopup(true);
      fetchPermissions(); // Refresh permissions to include the new group
    } else {
      throw new Error('Échec de la création du groupe');
    }
  } catch (error) {
    console.error('Erreur lors de la création du groupe:', error);
    setAlert({ message: 'Erreur lors de la création du groupe', type: 'danger' });
    setPopupMessage('Erreur lors de la création du groupe');
    setShowPopup(true);
  } finally {
    setLoadingCreate(false); // Set loading to false after creation attempt
    setShowCreateModal(false); // Close modal after creation

  }
};



  return (
   <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                {/* Sidebar Component directly included here */}
                <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />

                <div className="layout-page">
                    <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
                        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                            <a
                                className="nav-item nav-link px-0 me-xl-4"

                                onClick={toggleSidebar}  // Make sure this calls the toggleSidebar function
                            >
                                <FaBars className="ti ti-menu-2 ti-md" style={{ fontSize: '24px', color: 'black', cursor: 'pointer' }} />
                            </a>
                        </div>

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
                                            <a className="dropdown-item mt-0 waves-effect" href="/account">
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

         <div className="content">
<div className="d-flex justify-content-between align-items-center mb-3">
  <div className="d-flex align-items-center">
   {isAdmin && groupName !== 'Administrateurs' && (
    <Button variant="primary" onClick={handleSaveClick} className="me-2">
      <MdSaveAlt />
      Sauvegarder
    </Button>
             )}
    {isAdmin && groupName !== 'Administrateurs' && (
      <button
        onClick={handleToggleSelect}
        style={{
          backgroundColor: allSelected ? 'black' : 'lightgray',
          color: allSelected ? 'white' : 'black',
        }}
      >
        {allSelected ? (
          <>
            <MdDeselect style={{ marginRight: '5px' }} />
            Désélectionner tout
          </>
        ) : (
          <>
            <MdSelectAll style={{ marginRight: '5px' }} />
            Sélectionner tout
          </>
        )}
      </button>
    )}
  </div>

  <div className="d-flex align-items-center"> {/* Alignement à droite */}
   {isAdmin && groupName !== 'Administrateurs' && (
    <>
      <div>
            {/* Votre logique pour ouvrir le modal de mise à jour */}
            <Button variant="primary" onClick={() => { setUpdatedGroupName(groupName); setShowUpdateModal(true); }}>
                Modifier le groupe
            </Button>

            {/* Modal pour la mise à jour du groupe */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le groupe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        value={updatedGroupName}
                        onChange={(e) => setUpdatedGroupName(e.target.value)}
                        placeholder="Nom du groupe"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={updateGroupName}>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
     </>
     )}

  </div>
</div>



<div className="table-container">
  <Table className="table1">
    <thead>
      <tr>
        <th>Interfaces</th>
        <th>
          <input
            type="checkbox"
            checked={selectAll.add}
            onChange={() => handleSelectAllChange('add')}
          /> Créer
        </th>
        <th>
          <input
            type="checkbox"
            checked={selectAll.change}
            onChange={() => handleSelectAllChange('change')}
          /> Écrire
        </th>
        <th>
          <input
            type="checkbox"
            checked={selectAll.delete}
            onChange={() => handleSelectAllChange('delete')}
          /> Supprimer
        </th>
        <th>
          <input
            type="checkbox"
            checked={selectAll.view}
            onChange={() => handleSelectAllChange('view')}
          /> Lire
        </th>
        <th>
          <input
            type="checkbox"
            checked={selectAll.execute}
            onChange={() => handleSelectAllChange('execute')}
          /> Exécuter
        </th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(permissions)
        .filter((model) =>
          ['user', 'group',  'permission'].includes(model.toLowerCase())
        ) // Filtrer pour montrer uniquement Utilisateur, Groupe, Permission
        .sort((a, b) => {
    // Ordre personnalisé : Utilisateur, Groupe, Permission
    const order = ['user', 'group', 'permission'];
    return order.indexOf(a.toLowerCase()) - order.indexOf(b.toLowerCase());
  })

        .map((model) => {
          const perms = permissions[model].permissions;
          const translatedModel = {

            'user': 'Utilisateur',
            'group': 'Groupe',
            'permission': 'Permission'
          }[model] || model;

          // Check if the current model is "permission"
          const isPermissionModel = model.toLowerCase() === 'permission';
           // Check if the current model is "permission"

      const isDisabled = isAdmin && groupName === 'Administrateurs'; // Determine if the checkbox is disabled
          return (
            <tr key={model}>
              <td>{translatedModel}</td>
              <td>
               {!isPermissionModel && !isDisabled && ( // Only render if not permission model and not disabled
                <input
                  type="checkbox"
                  checked={perms['add_' + model]?.is_active || false}
                  onChange={(e) =>
                    handlePermissionChange(model, 'add_' + model, e.target.checked)
                  }
                  disabled={isAdmin && groupName === 'Administrateurs' ? true : isPermissionModel}
                />
                )}

              </td>
              <td>
               {!isDisabled && ( // Only render if not disabled
                <input
                  type="checkbox"
                  checked={perms['change_' + model]?.is_active || false}
                  onChange={(e) =>
                    handlePermissionChange(model, 'change_' + model, e.target.checked)
                  }
                  disabled={isAdmin && groupName === 'Administrateurs'}
                />
                 )}
              </td>
              <td>
               {!isPermissionModel && !isDisabled && (
                <input
                  type="checkbox"
                  checked={perms['delete_' + model]?.is_active || false}
                  onChange={(e) =>
                    handlePermissionChange(model, 'delete_' + model, e.target.checked)
                  }
                  disabled={isAdmin && groupName === 'Administrateurs' ? true : isPermissionModel}
                />
                 )}
              </td>

              <td>
               {!isDisabled && ( // Only render if not disabled
                <input
                  type="checkbox"
                  checked={perms['view_' + model]?.is_active || false}
                  onChange={(e) =>
                    handlePermissionChange(model, 'view_' + model, e.target.checked)
                  }
                   disabled={isAdmin && groupName === 'Administrateurs' }
                />
                 )}
              </td>
              <td>
               {false && ( // Always hide the 'Execute' checkbox
                <input
                  type="checkbox"
                  checked={perms['execute_' + model]?.is_active || false}
                  onChange={(e) =>
                    handlePermissionChange(model, 'execute_' + model, e.target.checked)
                 }
                disabled={true}
                />
                            )}

              </td>
            </tr>
          );
        })}
    </tbody>
  </Table>
   <div>
            {/* Bouton pour ouvrir le modal */}
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Créer un groupe
            </Button>

            {/* Modal pour la création du groupe */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Créer un nouveau groupe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Nom du nouveau groupe"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={createGroup} disabled={loadingCreate}>
                        {loadingCreate ? 'Création...' : 'Créer'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

</div>



   <Modal show={showConfirmModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la modification</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir modifier les permissions ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleConfirmSave}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
        </div>
                   <PopupAlert
    message={popupMessage}
    type={alert.type} // Assuming alert.type is set properly
    onClose={closePopup} // Make sure this is linked correctly
/>
        </div>
           </div>
             </div>
     </div>

  );
}

export default GroupPermissions;
