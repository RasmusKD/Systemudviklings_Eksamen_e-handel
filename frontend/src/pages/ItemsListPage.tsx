import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Truck, Smartphone, Shirt, Home, Dumbbell, Gamepad, Book, Car, Music, Camera, Utensils, Gift, Grid } from 'lucide-react';

interface Item {
    _id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    canBeSent: boolean;
}

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const categories = [
    { name: "Alle", icon: Grid },
    { name: "Elektronik", icon: Smartphone },
    { name: "Tøj", icon: Shirt },
    { name: "Hjem & Have", icon: Home },
    { name: "Sport", icon: Dumbbell },
    { name: "Legetøj", icon: Gamepad },
    { name: "Bøger", icon: Book },
    { name: "Biler", icon: Car },
    { name: "Musik", icon: Music },
    { name: "Foto & Video", icon: Camera },
    { name: "Mad & Drikke", icon: Utensils },
    { name: "Andet", icon: Gift },
];

const ItemsListPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("Alle");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [canBeSent, setCanBeSent] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const query = useQuery();
    const searchQuery = query.get("search") || "";

    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/items`);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        };
        fetchItems();
    }, []);

    const handleCategoryClick = (categoryName: string) => {
        if (categoryName === selectedCategory) {
            setSelectedCategory("Alle");
        } else {
            setSelectedCategory(categoryName);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Alle" || item.category === selectedCategory;
        const priceNumber = parseFloat(item.price.toString());
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        const matchesPrice = priceNumber >= min && priceNumber <= max;
        const matchesCanBeSent = canBeSent ? item.canBeSent : true;
        return matchesSearch && matchesCategory && matchesPrice && matchesCanBeSent;
    });

    return (
        <div className="flex space-x-6">
            <div className="w-52 space-y-4">
                <h3 className="text-xl font-bold mb-4 text-indigo-600">Kategorier</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => handleCategoryClick(category.name)}
                            className={`flex items-center justify-start w-full p-2 rounded-md transition-colors min-w-[120px] max-w-[200px] shadow-md hover:shadow-lg ${
                                selectedCategory === category.name
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <category.icon className="flex-shrink-0 w-5 h-5 mr-2" />
                            <span className="truncate">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow space-y-6">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Filtre</h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            {showFilters ? 'Skjul filtre' : 'Vis filtre'}
                            <ChevronDown className={`ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    {showFilters && (
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Min. Pris"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <input
                                    type="number"
                                    placeholder="Maks. Pris"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="canBeSent" className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="canBeSent"
                                        checked={canBeSent}
                                        onChange={(e) => setCanBeSent(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${canBeSent ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                        {canBeSent && (
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        )}
                                    </div>
                                    Kan sendes
                                </label>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => {
                                        setSelectedCategory("Alle");
                                        setMinPrice("");
                                        setMaxPrice("");
                                        setCanBeSent(false);
                                    }}
                                    className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Nulstil Filtre
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <Link to={`/items/${item._id}`} key={item._id} className="group">
                                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
                                    <img
                                        src={`${BASE_URL}/uploads/${item.image}`}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    {item.canBeSent && (
                                        <div className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1 flex items-center">
                                            <Truck className="w-4 h-4 text-indigo-600 mr-1" />
                                            <span className="text-xs font-medium text-indigo-600">Kan sendes</span>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
                                            {item.title}
                                        </h2>
                                        <p className="text-indigo-600 font-bold mt-2">
                                            {item.price} kr.
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-500 text-lg">Der var ingen annoncer, der matchede dine søgekriterier.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemsListPage;

