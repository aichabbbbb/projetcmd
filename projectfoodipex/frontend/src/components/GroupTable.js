import React, { useState, useEffect } from 'react';
import { useNavigate, Link,useLocation } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Navbar, Nav, Form, FormControl, Container, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaUsers ,FaArrowLeft, FaBars, FaTimes,FaSignOutAlt,FaUserCircle} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdGroupAdd } from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faBars } from '@fortawesome/free-solid-svg-icons'; // Importer l'icône
import { IoMdArrowDropdown } from 'react-icons/io'; // Import arrow dropdown icon
import { AiFillDashboard } from "react-icons/ai";
import { FaTable } from 'react-icons/fa'; // Import table icon


import './Manage.css';

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

function GroupTable() {
    const [groups, setGroups] = useState([]);
    const [newGroup, setNewGroup] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [updatedGroupName, setUpdatedGroupName] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [canViewPermission, setCanViewPermission] = useState(false);
    const [canAddGroup, setCanAddGroup] = useState(false); // Nouvelle permission pour ajouter un groupe
    const [canChangeGroup, setCanChangeGroup] = useState(false); // Permission pour modifier un groupe
    const [canDeleteGroup, setCanDeleteGroup] = useState(false); // Permission pour supprimer un groupe
     const [canViewGroup, setCanViewGroup] = useState(false); // Permission for viewing groups
  const [canExecuteGroup, setCanExecuteGroup] = useState(false); // Permission for executing group
    const [userPermissions, setUserPermissions] = useState([]); // Nouvel état pour stocker les permissions
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [user1, setUser] = useState({ email: '', profile_image: '' });
      const [loading, setLoading] = useState(true); // Added loading state
    const [customAlert, setCustomAlert] = useState({ message: '', type: '' });

    const [isExpanded, setIsExpanded] = useState(false);
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem('user')));
    const user = loggedInUser || {}; // Définit user
     const [showProfileMenu, setShowProfileMenu] = useState(false);

    const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
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
        fetchGroups();
        // Lire les données de l'utilisateur depuis le localStorage
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            const { permissions } = loggedInUser;
            setUserPermissions(permissions || []);
             // Check for the necessary permissions
             setCanViewPermission(permissions.some(permission => permission.codename === 'view_permission'));
             setCanAddGroup(permissions.some(permission => permission.codename === 'add_group'));
             setCanChangeGroup(permissions.some(permission => permission.codename === 'change_group'));
             setCanDeleteGroup(permissions.some(permission => permission.codename === 'delete_group'));
             setCanViewGroup(permissions.some(permission => permission.codename === 'view_group')); // New permission for viewing groups


                 // Si l'utilisateur n'a pas la permission `execute_group`, rediriger
            if (!permissions.some(permission => permission.codename === 'view_group')) {
                alert("Vous n'avez pas la permission d'accéder à cette page.");
                navigate('/dashboard'); // Rediriger vers une autre page (par exemple, le tableau de bord)
            }
        }
          // Appel pour récupérer les groupes
        if (canViewGroup) {
            fetchGroups();
        } else {
            setGroups([]); // Si l'utilisateur ne peut pas voir les groupes, affiche un tableau vide
        }

    }, [canViewGroup, canExecuteGroup, navigate]);


    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/groups/');
            setGroups(response.data);
        } catch (error) {
            console.error('There was an error fetching the groups!', error);
        }
    };
      // Fonction pour récupérer les permissions de l'utilisateur
    const fetchUserPermissions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/user/permissions/'); // Adapter l'URL selon ton backend
            setUserPermissions(response.data.permissions); // Supposons que les permissions soient renvoyées sous forme de tableau
        } catch (error) {
            console.error('Error fetching user permissions!', error);
        }
    };

    const createGroup = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/groups/', { name: newGroup });
            setGroups([...groups, response.data]);
            setNewGroup('');
            setShowCreateModal(false);
        } catch (error) {
            console.error('There was an error creating the group!', error);
        }
    };

const deleteGroup = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?");
    if (confirmDelete) {
        try {
            await axios.delete('http://127.0.0.1:8000/api/groups/', { data: { id } });
            setGroups(groups.filter(group => group.id !== id));
        } catch (error) {
            console.error('There was an error deleting the group!', error);
        }
    }
};


    const updateGroup = async () => {
        try {
            const response = await axios.put('http://127.0.0.1:8000/api/groups/', {
                id: selectedGroup.id,
                name: updatedGroupName
            });
            setGroups(groups.map(group => group.id === selectedGroup.id ? response.data : group));
            setShowUpdateModal(false);
        } catch (error) {
            console.error('There was an error updating the group!', error);
        }
    };

      // Vérification de la permission avant la redirection
  const handleGroupClick = (id) => {
    if (canViewPermission) {
        navigate(`/groups/${id}/permissions`);
    } else {
        setCustomAlert({ message: 'Vous n\'avez pas la permission de voir les permissions de ce groupe.', type: 'error' });
        setPopupMessage('Vous n\'avez pas la permission de voir les permissions de ce groupe.'); // Set the message
        setShowPopup(true); // Show the popup
    }
};
    const handleUpdateClick = (group) => {
        setSelectedGroup(group);
        setUpdatedGroupName(group.name);
        setShowUpdateModal(true);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
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


    return (
     <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                {/* Sidebar Component directly included here */}
                <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />

                <div className="layout-page">
                    <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
                        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">

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
               {canAddGroup && ( // Affiche le bouton "Créer un groupe" si l'utilisateur a la permission
                        <Button className="btn btn-primary btn-small mb-4" onClick={() => setShowCreateModal(true)}>
                             <MdGroupAdd  style={{ marginRight: '8px' }} /> Créer un groupe
                        </Button>
                    )}

            <div className="table-container">

                    <Table  className="table1">
                        <thead >
                            <tr>

                                <th>Nom de groupe </th>
                                <th>Actions</th>
                            </tr>
                        </thead>

      <tbody>
    {canViewGroup ? (
        groups
            .filter(group => group.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((group) => (
                <tr key={group.id}>
                    {/* Make only the group name cell clickable */}
                    <td >
                        {group.name}
                    </td>
                 <td>
    {canChangeGroup && ( // Vérifiez si l'utilisateur a la permission de changer le groupe
        <Button
            style={{ backgroundColor: "white", color: "black", borderColor: "black" }} // Style du bouton de redirection
            onClick={(e) => {
                e.stopPropagation(); // Empêche le clic sur la ligne de déclencher un événement
                navigate(`/groups/${group.id}/permissions`); // Redirection vers la page des permissions
            }}
            className="ms-2"
        >
            <FaEdit />
        </Button>
    )}

    {group.name !== 'Administrateurs' && canDeleteGroup && ( // Vérifiez si le groupe n'est pas "Administrateurs" et si l'utilisateur a la permission de supprimer
        <Button
            style={{ backgroundColor: "white", color: "black", borderColor: "black" }}
            onClick={(e) => {
                e.stopPropagation(); // Empêche le clic sur la ligne de déclencher un événement
                deleteGroup(group.id);
            }}
            className="ms-2"
        >
            <FaTrash />
        </Button>
    )}
</td>

                </tr>
            ))
    ) : (
        <tr>
            <td colSpan="2">Vous n'avez pas la permission de voir les groupes.</td> {/* Message d'absence de permission */}
        </tr>
    )}
</tbody>


                    </Table>


                    {/* Modal pour la création du groupe */}
                    <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Créer un nouveau groupe</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input
                                type="text"
                                className="form-control"
                                value={newGroup}
                                onChange={(e) => setNewGroup(e.target.value)}
                                placeholder="Nom du nouveau groupe"
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                                Annuler
                            </Button>
                            <Button variant="primary" onClick={createGroup}>
                                Créer
                            </Button>
                        </Modal.Footer>
                    </Modal>

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
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                                Annuler
                            </Button>
                            <Button variant="primary" onClick={updateGroup}>
                                Confirmer
                            </Button>
                        </Modal.Footer>
                    </Modal>

            </div>
         </div>
          {/* Popup Alert for Permission Check */}
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

export default GroupTable;