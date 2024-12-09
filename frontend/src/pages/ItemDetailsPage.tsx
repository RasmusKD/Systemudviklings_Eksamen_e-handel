import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ItemDetailsPage: React.FC = () => {
    const { id } = useParams();
    const [item, setItem] = useState<any>(null);

    useEffect(() => {
        const fetchItem = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/items/${id}`);
            if (response.ok) {
                const data = await response.json();
                setItem(data);
            }
        };
        fetchItem();
    }, [id]);

    if (!item) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl mb-4">{item.title}</h1>
            <img
                src={`http://localhost:3000${item.imageUrl}`}
                alt={item.title}
                className="mb-4"
            />
            <p className="text-gray-700">{item.description}</p>
            <p className="text-blue-500 mt-2">{item.price} kr.</p>
            <p className="text-gray-500 mt-2">Category: {item.category}</p>
            <p className="text-gray-500 mt-2">Seller: {item.seller}</p>
        </div>
    );
};

export default ItemDetailsPage;
