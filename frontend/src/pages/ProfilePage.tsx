import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Loader, PlusCircle, Trash2 } from 'lucide-react';
import fetchWithAuth from '../utils/fetchWithAuth';

interface UserListing {
    _id: string;
    title: string;
    price: number;
    image: string;
    imageUrl?: string; // Added imageUrl property
}

interface UserProfile {
    _id: string;
    username: string;
    email: string;
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [userListings, setUserListings] = useState<UserListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleDeleteItem = async (itemId: string) => {
        if (window.confirm('Er du sikker på, at du vil slette denne annonce?')) {
            try {
                const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/items/${itemId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setUserListings(prevListings => prevListings.filter(listing => listing._id !== itemId));
                } else {
                    console.error('Failed to delete item:', response.status, response.statusText);
                    alert('Der opstod en fejl under sletning af annoncen. Prøv igen senere.');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Der opstod en fejl under sletning af annoncen. Prøv igen senere.');
            }
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/users/profile`);
                if (response.ok) {
                    const userData = await response.json();
                    console.log('User data fetched:', userData);
                    setUser(userData);
                } else {
                    console.error('Failed to fetch user profile:', response.status, response.statusText);
                    if (response.status === 401) {
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user profile');
                navigate('/login');
            }
        };

        const fetchUserListings = async () => {
            try {
                console.log('Fetching user listings...');
                const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/items/user`);
                if (response.ok) {
                    const listingsData = await response.json();
                    console.log('User listings fetched:', listingsData);
                    setUserListings(listingsData);
                } else {
                    console.error('Failed to fetch user listings:', response.status, response.statusText);
                    setError('Failed to fetch user listings');
                }
            } catch (error) {
                console.error('Error fetching user listings:', error);
                setError('Failed to fetch user listings');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
        fetchUserListings();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Min Profil</h1>
                {user && (
                    <div className="flex items-center space-x-4">
                        <User className="w-6 h-6 text-indigo-600" />
                        <div>
                            <p className="font-semibold">Brugernavn: {user.username}</p>
                            <p>Email: {user.email}</p>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold flex items-center">
                        <Package className="w-6 h-6 mr-2 text-indigo-600" />
                        Mine Annoncer
                    </h2>
                    <Link
                        to="/items/new"
                        className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        <PlusCircle className="w-5 h-5 mr-1" />
                        Opret ny annonce
                    </Link>
                </div>
                {userListings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {userListings.map((listing) => (
                            <div key={listing._id} className="relative group">
                                <Link to={`/items/${listing._id}`} className="block">
                                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                        <img
                                            src={listing.imageUrl || `${process.env.REACT_APP_BASE_URL}/uploads/${listing.image}`}
                                            alt={listing.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
                                                {listing.title}
                                            </h3>
                                            <p className="text-indigo-600 font-bold mt-2">
                                                {listing.price} kr.
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => handleDeleteItem(listing._id)}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Slet annonce"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Du har ingen aktive annoncer.</p>
                        <Link
                            to="/items/new"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Opret din første annonce
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
