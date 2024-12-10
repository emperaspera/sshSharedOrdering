import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold text-green-600 mb-6">Order Successful!</h1>
                <p className="text-lg text-gray-700 mb-6">
                    Your order has been placed successfully. Thank you for shopping with us!
                </p>
                <button
                    onClick={() => navigate("/main")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-500 transition-all duration-300 mt-4"
                >
                    Back to Supermarkets
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;
