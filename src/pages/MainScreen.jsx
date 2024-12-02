import React from "react";
import { Link } from "react-router-dom";
import supermarkets from "../supermarketData";
import Navigation from "../components/navbar/Navigation";
import Ratings from "../components/Ratings";
import SupermarketCard from "../components/SupermarketCard";

const MainScreen = () => {
    return (
        <div> 
            <Navigation/>
            <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Supermarkets</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                    {supermarkets.map((supermarket) => (
                        <Link
                            key={supermarket.id}
                            to={`/main/inventory/${supermarket.id}`}
                            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                        >
                            <h2 className="text-2xl font-bold text-gray-800">{supermarket.name}</h2>
                            <p className="text-gray-600">{supermarket.description}</p>
                            <div className="mt-3">
                                <Ratings initialRating={supermarket.rating} onRatingChange={(newRating) => console.log(`Rating for ${supermarket.name} changed to ${newRating}`)} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>    
    );
};

export default MainScreen;