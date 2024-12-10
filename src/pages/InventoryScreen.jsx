import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useBasket} from "../context/BasketContext";
import supermarkets from "../supermarketData";
import Navigation from "../components/Navigation/Navigation.jsx";

const InventoryScreen = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {basket, addToBasket, setLastVisitedSupermarket} = useBasket();
    const supermarket = supermarkets.find((s) => s.id === parseInt(id));
    const [notification, setNotification] = useState(null);
    const [, setIsHouseholdLogin] = useState(false);
    const [, setHouseholdData] = useState(null);

    const scrollPositions = {};

    // Determine login type on component mount
    useEffect(() => {
        const household = JSON.parse(localStorage.getItem("household"));
        const user = JSON.parse(localStorage.getItem("user"));

        if (household) {
            setIsHouseholdLogin(true);
            setHouseholdData(household); // Save household data for the profile picture
        } else if (user) {
            setIsHouseholdLogin(false);
        } else {
            // Redirect to login if no valid session
            navigate("/login");
        }
    }, [navigate]);

    const scrollCategory = (categoryName, direction) => {
        const container = document.getElementById(`category-${categoryName}`);
        if (container) {
            const scrollAmount = 400;
            const newPosition =
                (scrollPositions[categoryName] || 0) + direction * scrollAmount;
            container.scrollTo({
                left: newPosition,
                behavior: "smooth",
            });
            scrollPositions[categoryName] = newPosition;
        }
    };

    if (!supermarket) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-red-600">Supermarket Not Found</h1>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg transition relative overflow-hidden group"
                >
                    <span
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                    <span className="relative z-10">Back to Home</span>
                </button>
            </div>
        );
    }

    const handleAddToBasket = (item) => {
        addToBasket(item, supermarket.id);
        setNotification(`${item.name} has been added to your basket!`);
        setTimeout(() => setNotification(null), 2000);
    };

    return (
        <>
            <Navigation/>
            <div className="min-h-screen bg-gray-100 p-6 relative">

                <div className="flex flex-col items-center mb-6">
                    <img
                        src={supermarket.image}
                        alt={supermarket.name}
                        className="w-full max-w-4xl h-64 object-cover rounded-lg mb-4"
                    />
                    <h1 className="text-4xl font-bold text-gray-800">{supermarket.name}</h1>
                    <p className="text-gray-600">{supermarket.description}</p>
                </div>

                <div className="w-full max-w-4xl mx-auto">
                    {supermarket.categories.map((category) => (
                        <div key={category.name} className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                {category.name}
                            </h2>
                            <div className="relative">
                                <div
                                    id={`category-${category.name}`}
                                    className="flex overflow-x-auto space-x-4 scrollbar-hide"
                                >
                                    {category.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white shadow-md rounded-lg p-4 flex-shrink-0 w-56 flex flex-col items-center"
                                        >
                                            <img
                                                src={item.image} // Ensures images load based on the path
                                                alt={item.name}
                                                className="w-24 h-24 object-cover mb-4"
                                            />
                                            <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                            <p className="text-gray-600 text-center">{item.description}</p>
                                            <p className="text-lg font-bold text-gray-800 mt-2">${item.price}</p>
                                            <button
                                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg transition relative overflow-hidden group"
                                                onClick={() => handleAddToBasket(item)}
                                            >
                                                <span
                                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                                                <span className="relative z-10">Add to Basket</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 shadow-md hover:bg-gray-700 transition"
                                    onClick={() => scrollCategory(category.name, -1)}
                                >
                                    ←
                                </button>
                                <button
                                    className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 shadow-md hover:bg-gray-700 transition"
                                    onClick={() => scrollCategory(category.name, 1)}
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => navigate("/main")}
                    className="sticky bottom-4 left-0 ml-4 bg-blue-500 text-white px-6 py-3 w-48 rounded-lg shadow-lg transition relative overflow-hidden group"
                >
                    <span className="absolute inset-0 bg-gradient-to-l from-red-500 to-transparent transform scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                    <span className="relative z-10 text-center">Go Back</span>
                </button>

                {basket.length > 0 && (
                    <button
                        onClick={() => {
                            setLastVisitedSupermarket(supermarket.id);
                            navigate("/main/basket");
                        }}
                        className="sticky bottom-4 ml-[90%] sm:ml-[15%] md:ml-[70%] bg-green-500 text-white px-6 py-3 w-48 rounded-lg shadow-lg transition relative overflow-hidden group"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                        <span className="relative z-10 text-center">
                            Show Basket ({basket.length})
                        </span>
                    </button>
                )}

                {notification && (
                    <div className="fixed top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
                        {notification}</div>
                )}
            </div>
        </>
    );
};

export default InventoryScreen;
