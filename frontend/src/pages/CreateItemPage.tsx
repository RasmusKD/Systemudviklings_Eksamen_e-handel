import React, { useState } from 'react';

import axios from 'axios';
//hej test commit
const CreateItemPage: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post('/api/items', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Item created successfully!');
            console.log(response.data);
        } catch (error: any) {
            setMessage(error.response?.data?.error || 'Failed to create item');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Create New Item</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Image</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Create Item
                </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
};

export default CreateItemPage;
