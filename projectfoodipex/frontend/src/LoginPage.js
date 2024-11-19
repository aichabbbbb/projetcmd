import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState(''); // Utilise l'email comme identifiant
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Envoi de l'email et du mot de passe
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Réinitialiser les erreurs précédentes
        setEmailError('');
        setPasswordError('');
        setError(null);

        // Déterminer quelle erreur s'est produite
        if (errorData.detail) {
          if (errorData.detail.includes('password')) {
            setPasswordError('Mot de passe incorrect');
          } else if (errorData.detail.includes('email')) {
            setEmailError('Email incorrect');
          } else {
            setError(errorData.detail);
          }
        } else {
          setError('Erreur de connexion');
        }
      } else {
        const data = await response.json();
        console.log('Login response data:', data);

        // Stocker les informations pertinentes de l'utilisateur dans le stockage local
        localStorage.setItem('token', data.access);
        localStorage.setItem('user', JSON.stringify({
          username: data.username,
          email: data.email,
          id: data.id,
          first_name: data.first_name || '', // Stocker le prénom
          last_name: data.last_name || '', // Stocker le nom de famille
          is_superuser: data.is_superuser,
          is_staff: data.is_staff,
          restaurant_names: data.restaurants || [], // Stocker les noms des restaurants
          groups: data.groups || [], // Stocker les noms des groupes
          permissions: data.permissions || [] // Stocker les permissions
        }));

        setIsAuthenticated(true);
        navigate('/Dashboard');
      }
    } catch (error) {
      setError('Erreur de requête ou identifiants invalides');
      console.error("Login error:", error.message);
    } finally {
      setLoading(false); // Réinitialiser l'état de chargement après la requête
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner py-6">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center mb-6">
                <a href="/" className="app-brand-link">
                  <span className="app-brand-logo demo"></span>
                  <span className="app-brand-text demo text-heading fw-bold">Connexion</span>
                </a>
              </div>
              <h4 className="mb-1">Bienvenue! 👋</h4>
              <p className="mb-6">Veuillez vous connecter à votre compte et commencer</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${emailError ? 'is-invalid' : ''}`} // Ajout de la classe d'erreur si besoin
                    id="email"
                    placeholder="Entrer votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {emailError && <div className="form-text text-danger">{emailError}</div>}
                </div>

                <div className="mb-6 position-relative">
                  <label htmlFor="password" className="form-label">Mot de Passe</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`form-control ${passwordError ? 'is-invalid' : ''}`} // Ajout de la classe d'erreur si besoin
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="cursor-pointer position-absolute"
                    style={{ right: '10px', top: '38px' }}
                    onClick={togglePasswordVisibility}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
                  {passwordError && <div className="form-text text-danger">{passwordError}</div>}
                </div>

                <div className="mb-6">
                  <button
                    className="btn d-grid w-100"
                    type="submit"
                    style={{ backgroundColor: '#7367f0', borderColor: '#7367f0' }}
                    disabled={loading} // Désactiver le bouton si le chargement est en cours
                  >
                    {loading ? 'Connexion...' : 'Connecter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
