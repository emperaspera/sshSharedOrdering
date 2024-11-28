import React from "react";
import { Link } from "react-router-dom";

const SupermarketCard = ({ id, name, description, rating }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 w-96 hover:shadow-lg transition-shadow">
            <Link to={`/main/inventory/${id}`}>
                <h2 className="text-2xl font-semibold text-gray-700">{name}</h2>
                <p className="text-gray-600">{description}</p>
                <div className="mt-3">
                    <span className="inline-block bg-yellow-300 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ {rating}
                    </span>
                </div>
            </Link>
        </div>
    );
};

export default SupermarketCard;
