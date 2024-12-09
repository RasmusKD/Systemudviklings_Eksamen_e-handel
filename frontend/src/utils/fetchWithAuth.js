import { jwtDecode } from 'jwt-decode'; // Use the named export

export const isTokenExpired = (token) => {
    try {
        const { exp } = jwtDecode(token); // Decode the token to get expiration
        return Date.now() >= exp * 1000; // Compare current time with expiration
    } catch (error) {
        console.error('Error decoding token:', error.message);
        return true; // Treat token as expired if decoding fails
    }
};

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token'); // Get token from local storage

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token'); // Clear expired token
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login'; // Redirect to login page
        return;
    }

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`, // Add token to the Authorization header
    };

    return fetch(url, { ...options, headers });
};

export default fetchWithAuth;
