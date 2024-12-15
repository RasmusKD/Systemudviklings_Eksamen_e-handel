import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        return Date.now() >= exp * 1000;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.dispatchEvent(new Event('storage'));
        throw new Error('Authentication required');
    }

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);

    return fetch(url, { ...options, headers });
};

export default fetchWithAuth;
