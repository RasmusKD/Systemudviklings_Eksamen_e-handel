import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Smartphone, Shirt, Home, Dumbbell, Gamepad, Book, Car, Music, Camera, Utensils, Gift } from 'lucide-react';
import toast from "react-hot-toast";

const categories = [
    "Elektronik",
    "Tøj",
    "Hjem & Have",
    "Sport",
    "Legetøj",
    "Bøger",
    "Biler",
    "Musik",
    "Foto & Video",
    "Mad & Drikke",
    "Andet",
];

const getCategoryIcon = (category: string) => {
    switch (category) {
        case "Elektronik": return <Smartphone className="w-5 h-5" />;
        case "Tøj": return <Shirt className="w-5 h-5" />;
        case "Hjem & Have": return <Home className="w-5 h-5" />;
        case "Sport": return <Dumbbell className="w-5 h-5" />;
        case "Legetøj": return <Gamepad className="w-5 h-5" />;
        case "Bøger": return <Book className="w-5 h-5" />;
        case "Biler": return <Car className="w-5 h-5" />;
        case "Musik": return <Music className="w-5 h-5" />;
        case "Foto & Video": return <Camera className="w-5 h-5" />;
        case "Mad & Drikke": return <Utensils className="w-5 h-5" />;
        default: return <Gift className="w-5 h-5" />;
    }
};

const CreateItemPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [canBeSent, setCanBeSent] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("canBeSent", canBeSent.toString());
        if (image) {
            formData.append("image", image);
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/items`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                toast.success("Varen blev oprettet!");
                navigate("/");
            } else {
                const data = await response.json();
                setErrors(data.details || ["Kunne ikke oprette varen."]);
            }
        } catch (err) {
            setErrors(["Der opstod en uventet fejl."]);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-6">Opret ny vare</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Titel
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Beskrivelse
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Pris (DKK)
                        </label>
                        <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Kategori
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">Vælg en kategori</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat} className="flex items-center">
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {category && (
                            <div className="mt-2 flex items-center text-gray-600">
                                {getCategoryIcon(category)}
                                <span className="ml-2">{category}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="canBeSent" className="flex items-center">
                            <input
                                id="canBeSent"
                                type="checkbox"
                                checked={canBeSent}
                                onChange={(e) => setCanBeSent(e.target.checked)}
                                className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Kan sendes</span>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                            Billede
                        </label>
                        <div className="flex items-center">
                            <label htmlFor="image" className="cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span>Vælg fil</span>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setImage(file);
                                        setFileName(file ? file.name : null);
                                    }}
                                    className="sr-only"
                                />
                            </label>
                            <span className="ml-3 text-sm text-gray-500">
                                {fileName || 'Ingen fil valgt'}
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Opret vare
                    </button>
                </form>
                {errors.length > 0 && (
                    <div className="mt-4 text-red-600">
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateItemPage;

