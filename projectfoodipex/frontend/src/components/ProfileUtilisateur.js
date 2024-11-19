import React, { useEffect, useState } from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { updateUser, getGroups, getRestaurants } from '../services/UserService';
import { FaUserEdit } from "react-icons/fa";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();


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

const ProfileUtilisateur = (props) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        is_active: true,
        is_superuser: false,
        is_staff: false,
        group_names: [],
        restaurant_names: []
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
    const [formErrors, setFormErrors] = useState({ username: '', email: '' }); // State for form error messages
    const [usernameError, setUsernameError] = useState(''); // État pour l'erreur de nom d'utilisateur
    const [emailError, setEmailError] = useState(''); // État pour l'erreur d'e-mail



    const { show, user, setUpdated, onHide } = props;

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                is_active: user.is_active || true,
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

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

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
            setFormErrors({ username: '', email: '' }); // Clear errors on successful update
             setUsernameError(''); // Clear username error
            setEmailError(''); // Clear email error
            if (setUpdated) setUpdated();
            onHide();
        } catch (error) {
            console.error("Échec de la mise à jour de l'utilisateur:", error.response?.data || error.message);
           // Check for specific error messages and set alert accordingly

            if (error.response?.data.error) {
                if (error.response.data.error.includes("nom d'utilisateur")) {
                    setUsernameError("Le nom d'utilisateur existe déjà.");
                } else if (error.response.data.error.includes("email")) {
                    setEmailError("L'adresse email existe déjà.");
                }
            } else {
                setAlert({ message: "Échec de la mise à jour de l'utilisateur", type: 'error' });
            }

            setShowPopup(true);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const groupOptions = groups.map(group => ({
        value: group.name,
        label: group.name
    }));

    const restaurantOptions = restaurants.map(restaurant => ({
        value: restaurant.name,
        label: restaurant.name
    }));

 // Vérifiez si l'utilisateur appartient au groupe "Administrateur"
    const isAdmin = formData.group_names.includes('Administrateurs');


    if (!user) {
        return null; // Ou affichez un état de chargement
    }

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <FaUserEdit style={{ marginRight: '10px' }} />
                        Mettre à jour les informations de l'utilisateur
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={6}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="username">
                                    <Form.Label>Nom d'utilisateur :</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Entrez le nom d'utilisateur"
                                    />
                                      {usernameError && <small className="text-danger">{usernameError}</small>} {/* Affichage de l'erreur */}
                                </Form.Group>
                                <Form.Group controlId="email">
                                    <Form.Label>Email :</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Entrez l'email"
                                    />
                                      {emailError && <small className="text-danger">{emailError}</small>} {/* Affichage de l'erreur */}


                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Mot de passe :</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Entrez un nouveau mot de passe (laissez vide pour conserver l'actuel)"
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
                                <Form.Group controlId="confirmPassword">
                                    <Form.Label>Confirmer le mot de passe :</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirmez le nouveau mot de passe"
                                    />
                                     {!passwordMatch && formData.confirmPassword && (
                                        <Form.Text className="text-danger">
                                            Les mots de passe ne correspondent pas
                                        </Form.Text>
                                    )}
                                </Form.Group>
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
                                <Form.Group controlId="is_active">
                                    <Form.Check
                                        type="checkbox"
                                        name="is_active"
                                        label="Actif"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" type="submit">
                                        Soumettre
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={onHide}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

           {showPopup && (
                <PopupAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={closePopup}
                />
            )}
        </>
    );
};

export default ProfileUtilisateur;
