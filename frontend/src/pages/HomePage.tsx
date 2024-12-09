import React, { useEffect, useState } from 'react';
import { fetchItems } from '../api/itemApi';

const HomePage: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const getItems = async () => {
            try {
                const data = await fetchItems();
                setItems(data);
            } catch (error) {
                console.error(error);
            }
        };
        getItems();
    }, []);

    return (
        <div>
            <h1 className="text-3xl mb-4">Available Items</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((item) => (
                    <div key={item._id} className="border p-4">
                        <h2 className="text-xl">{item.title}</h2>
                        <p>{item.description}</p>
                        <p>Price: {item.price} DKK</p>
                        <p>Category: {item.category}</p>
                        <p>Can be sent: {item.canBeSent ? 'Yes' : 'No'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
