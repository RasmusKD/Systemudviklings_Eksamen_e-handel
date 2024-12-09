import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateItemPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [canBeSent, setCanBeSent] = useState(false);
    const [image, setImage] = useState<File | null>(null);
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

        const token = localStorage.getItem("token"); // Get the token from localStorage

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/items`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                },
                body: formData,
            });

            if (response.ok) {
                alert("Item created successfully!");
                navigate("/"); // Redirect to home after successful creation
            } else {
                const data = await response.json();
                setErrors(data.details || ["Failed to create item."]);
            }
        } catch (err) {
            setErrors(["An unexpected error occurred."]);
        }
    };

    return (
        <div>
            <h1 className="text-3xl mb-4">Create Item</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block">Price</label>
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block">Category</label>
                    <input
                        id="category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="canBeSent" className="block">
                        <input
                            id="canBeSent"
                            type="checkbox"
                            checked={canBeSent}
                            onChange={(e) => setCanBeSent(e.target.checked)}
                        />
                        Can be sent
                    </label>
                </div>
                <div>
                    <label htmlFor="image" className="block">Image</label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="border p-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create Item
                </button>
            </form>
            {errors.length > 0 && (
                <div className="mt-4 text-red-500">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CreateItemPage;
