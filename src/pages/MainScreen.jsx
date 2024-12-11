import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import supermarkets from "../supermarketData";
import Navigation from "../components/Navigation/Navigation.jsx";
import { calcEuclideanDist } from "../context/GlobalFuncs";
import { useBasket } from "../context/BasketContext";

// Import the Input component
import Input from "../components/Input";

const MainScreen = () => {
    const [sortOption, setSortOption] = useState("best");
    const [searchTerm, setSearchTerm] = useState(""); // Added state for search term
    const household = JSON.parse(localStorage.getItem("household"));
    const { basket } = useBasket();
    const navigate = useNavigate();

    const maxRating = Math.max(...supermarkets.map((s) => s.rating));
    const maxDistance = Math.max(...supermarkets.map((s) => s.distance || 0));

    // Calculate distances for all supermarkets
    const supermarketsWithDistances = supermarkets.map((supermarket) => {
        if (household) {
            supermarket.distance = calcEuclideanDist(household, supermarket);
            console.log(`Distance to ${supermarket.name}:`, supermarket.distance);
        }
        return supermarket;
    });

    // Function to calculate the "best" score based on rating and distance
    const calculateBestScore = (supermarket, maxRating, maxDistance) => {
        const ratingWeight = 0.6;
        const distanceWeight = 0.4;

        const normalizedRating = supermarket.rating / maxRating;
        const normalizedDistance = 1 - (supermarket.distance / maxDistance);

        return ratingWeight * normalizedRating + distanceWeight * normalizedDistance;
    };

    // Sort supermarkets based on the selected sort option
    const sortedSupermarkets = [...supermarketsWithDistances].sort((a, b) => {
        switch (sortOption) {
            case "rating-high-low":
                return b.rating - a.rating;
            case "rating-low-high":
                return a.rating - b.rating;
            case "distance-low-high":
                return a.distance - b.distance;
            case "distance-high-low":
                return b.distance - a.distance;
            case "best":
                return calculateBestScore(b, maxRating, maxDistance) - calculateBestScore(a, maxRating, maxDistance);
            default:
                return 0;
        }
    });

    // Filter supermarkets by the searchTerm (store name)
    const filteredSupermarkets = sortedSupermarkets.filter((supermarket) =>
        supermarket.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Navigation />
            <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Supermarkets</h1>

                {/* Search Bar */}
                <div className="mb-4">
                    <Input
                        value={searchTerm}               // Pass the current searchTerm
                        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input
                    />
                </div>

                {/* Sorting dropdown */}
                <div className="mb-4">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-4 focus:border-blue-500 focus:outline-none shadow-sm transition"
                    >
                        <option value="best">Sort by Best</option>
                        <option value="rating-high-low">Rating: High to Low</option>
                        <option value="rating-low-high">Rating: Low to High</option>
                        {household && <option value="distance-low-high">Distance: Low to High</option>}
                        {household && (
                            <option value="distance-high-low">Distance: High to Low</option>
                        )}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                    {filteredSupermarkets.map((supermarket) => (
                        <Link
                            key={supermarket.id}
                            to={`/main/inventory/${supermarket.id}`}
                            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                        >
                            <h2 className="text-2xl font-bold text-gray-800">{supermarket.name}</h2>
                            <p className="text-gray-600">{supermarket.description}</p>
                            <p className="text-yellow-500 font-semibold mt-2">⭐ {supermarket.rating}</p>
                            {household && supermarket.distance !== undefined && (
                                <p className="text-gray-500 mt-2">📍 {supermarket.distance.toFixed(2)} km away</p>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Show Basket Button */}
                {basket.length > 0 && (
                    <button
                        onClick={() => navigate("/main/basket")}
                        className="sticky bottom-4 bg-green-500 text-white px-6 py-3 w-48 rounded-lg shadow-lg transition relative overflow-hidden group my-7 item-center"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                        <span className="relative z-10 text-center">
                            Show Basket ({basket.length})
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MainScreen;
