/*import React, { useEffect, useState } from 'react';
import { Table, Navbar, Nav, Container, Form, FormControl, Dropdown } from 'react-bootstrap';
import { Link, useLocation ,useNavigate} from 'react-router-dom';
import { getUsers } from '../services/UserService';
import "../App.css";
import { FaSearch, FaUsers ,FaArrowLeft} from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const location = useLocation();
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const userPermissions = loggedInUser.permissions;
  const userGroups = loggedInUser.groups;
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getUsers()
      .then((data) => {
        if (mounted) {
          // Filter users based on permissions
          const canViewUser = userPermissions.some(p => p.codename === 'view_user');
          const canViewSelf = userPermissions.some(p => p.codename === 'execute_user');

          if (!canViewUser && canViewSelf) {
            // If only can view self, filter the users list
            const filteredData = data.filter(user => user.id === loggedInUser.id);
            setUsers(filteredData);
            setFilteredUsers(filteredData);
          } else {
            setUsers(data);
            setFilteredUsers(data);
          }
        }
      });
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.group_names.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchQuery, users]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const getActiveMenu = () => {
    switch (location.pathname) {
      case '/home':
        return 'Home';
      case '/users':
        return 'Users';
      case '/manage':
        return 'Manage';
      case '/groups':
        return 'Groups';
      default:
        return 'Permission';
    }
  };

  return (
    <>

      <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
        <Container>
          <Navbar.Brand as={Link} to="/home">
           <FaArrowLeft
                            className="me-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(-1)} // Retour à la page précédente
                        />
            <FaUsers className="me-2" /> Users
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Item>
                <Nav.Link as={Link} to="/home" className={isActive('/home')}>Home</Nav.Link>
              </Nav.Item>
              <Dropdown align="end">
                <Dropdown.Toggle id="dropdown-basic-button" variant="secondary">
                  {getActiveMenu()}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/users" className={isActive('/users')}>Users</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/manage" className={isActive('/manage')}>Manage</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/groups" className={isActive('/groups')}>Groups</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
            <Form className="d-flex ms-auto search-form">
              <FormControl
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <FaSearch className="search-icon" />
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container-fluid table-container">
        <div className="row side-row">
          <Table striped bordered hover className="react-bootstrap-table" id="dataTable">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Active</th>
                <th>Groups</th>
                <th>Restaurant</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.is_active ? 'Yes' : 'No'}</td>
                  <td>{user.group_names.length > 0 ? user.group_names.join(', ') : 'N/A'}</td>
                  <td>{user.restaurant_name || ''}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Users;
*/