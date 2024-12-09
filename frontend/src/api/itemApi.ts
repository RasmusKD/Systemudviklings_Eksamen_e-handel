const API_URL = process.env.REACT_APP_API_URL;

export const fetchItems = async () => {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) {
        throw new Error('Failed to fetch items');
    }
    return response.json();
};
