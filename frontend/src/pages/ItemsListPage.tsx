import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ItemsListPage: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);

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

    return (
        <div>
            <h1 className="text-3xl mb-4">Items</h1>
            <div className="grid grid-cols-3 gap-4">
                {items.map((item) => (
                    <Link to={`/items/${item._id}`} key={item._id}>
                        <div className="border p-4 rounded">
                            <img
                                src={`http://localhost:3000/uploads/${item.image}`} // Construct the full URL
                                alt={item.title}
                                className="mb-2"
                            />
                            <h2 className="text-lg font-bold">{item.title}</h2>
                            <p className="text-blue-500">{item.price} kr.</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ItemsListPage;
