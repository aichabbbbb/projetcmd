import axios from 'axios';

// Connexion de l'utilisateur
export function loginUser(credentials) {
  return axios.post('http://127.0.0.1:8000/api/token/', credentials)
    .then(response => {
      // Store user info along with token in localStorage
      const userData = { ...response.data.user, access: response.data.access };
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    })
    .catch(error => {
      console.error("Login failed:", error.response.data);
      throw error;
    });
}


// Vérification de l'authentification
export function checkAuth() {
  return axios.get('http://127.0.0.1:8000/api/check-auth/')
    .then(response => response.data);
}


export const getUsers = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/users/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).access}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Include profile image in each user
      const usersWithImages = data.map(user => ({
        ...user,
        profile_image: user.profile_image || null, // Ensure default value
      }));

      return usersWithImages;
    }

    throw new Error('Failed to fetch users');
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Suppression d'un utilisateur
export function deleteUser(id) {
  return axios.delete(`http://127.0.0.1:8000/users/${id}/`, { // Fixed backticks
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).access}`, // Fixed syntax
    }
  })
  .then(response => response.data)
  .catch(error => {
    console.error('Error deleting user:', error.response ? error.response.data : error.message);
    throw error;
  });
}


export const getUserById = async (uid) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/users/${uid}/`); // Mettez à jour l'URL en fonction de votre API
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la récupération de l\'utilisateur');
    }
};


// Ajout d'un utilisateur
export function addUser(user) {
    // Récupérer le token d'accès
    const token = JSON.parse(localStorage.getItem('user'))?.access;

    // Construction de l'objet restaurant_details avec id, name et city
    const restaurantDetails = (user.restaurant_details || []).map(restaurant => ({
        id: restaurant.id || null, // Utiliser null si aucun ID n'est fourni
        name: restaurant.name || '', // Assurez-vous que le nom existe
        city: restaurant.city || '', // Assurez-vous que la ville existe
    }));

    // Construction de l'objet utilisateur à envoyer
    const userData = {
        email: user.email || '', // S'assurer qu'il y a une chaîne vide si pas d'email
        password: user.password || '', // S'assurer qu'il y a une chaîne vide si pas de mot de passe
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        is_active: user.is_active || true, // Par défaut à true
        is_superuser: user.is_superuser || false, // Par défaut à false
        is_staff: user.is_staff || false, // Par défaut à false
        groups: user.group_names || [], // Utiliser les noms ou les ID des groupes si nécessaire
        restaurant_details: restaurantDetails, // Inclure les détails des restaurants
    };

    // Appel à l'API pour ajouter l'utilisateur
    return axios.post('http://127.0.0.1:8000/users/', userData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error adding user:', error.response?.data || error.message);
        throw error; // Propagation de l'erreur pour gestion ultérieure
    });
}



export function updateUser(uid, user) {
    const token = JSON.parse(localStorage.getItem('user')).access;

    // Construction de l'objet restaurant_details avec id, name et city
    const restaurantDetails = (user.restaurant_details || []).map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        city: restaurant.city,
    }));

    return axios.put(`http://127.0.0.1:8000/users/${uid}/`, {

        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        password: user.password || undefined,
        is_active: user.is_active,
        is_superuser: user.is_superuser,
        is_staff: user.is_staff,
        groups: user.group_names || [],   // Envoi des groupes sélectionnés
        restaurant_details: restaurantDetails,  // Envoyer les détails des restaurants (id, nom, ville)
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error.response?.data || error.message);
        throw error;
    });
}

// Récupération des groupes
export const getGroups = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/groups/');
    return response.data; // Assurez-vous que le backend renvoie une liste de groupes
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    throw error;
  }
};

// Récupération des restaurants
export const getRestaurants = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/restaurants/');
    // Inclure les villes dans la réponse
    const restaurantsWithCities = response.data.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      city: restaurant.ville, // Assurez-vous que le champ ville existe
    }));
    return restaurantsWithCities;
  } catch (error) {
    console.error("Failed to fetch restaurants:", error.response ? error.response.data : error.message);
    throw error;
  }
};
// Récupération des détails d'un groupe par ID
export const getGroupDetails = async (id) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/groups/${id}/`);
    return response.data; // Détails du groupe avec les permissions
  } catch (error) {
    console.error("Failed to fetch group details:", error);
    throw error;
  }
};

export const updateUser1 = async (userId, formData) => {
    const response = await axios.post(`/api/update-profile/${userId}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Get restaurants by city
export const getRestaurantsByCity = async (city) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/restaurants/${city}/`); // Ensure the URL corresponds to the endpoint
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch restaurants in city ${city}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};


// Get all cities
export const getCities = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/cities/'); // Added trailing slash for consistency with RESTful API style
        return response.data; // Return the list of cities
    } catch (error) {
        console.error("Failed to fetch cities:", error.response ? error.response.data : error.message);
        throw error; // Rethrow the error to handle it in the calling component
    }
};


export const getCitiesWithRestaurants = async () => {
  try {
    const cities = await getCities(); // Fetch cities
    const citiesWithRestaurants = await Promise.all(
      cities.map(async (city) => {
        const restaurants = await getRestaurantsByCity(city.name); // Ensure 'name' is correct
        return {
          ...city,
          restaurants,
        };
      })
    );
    return citiesWithRestaurants;
  } catch (error) {
    console.error("Failed to fetch cities with restaurants:", error);
    throw error;
  }
};