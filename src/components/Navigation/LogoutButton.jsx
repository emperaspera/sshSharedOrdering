
import { useNavigate } from "react-router-dom";
import {useBasket} from "../../context/BasketContext.jsx";

const LogoutButton = () => {
    const navigate = useNavigate();
    const { clearBasket } = useBasket();

    const handleLogout = () => {
        clearBasket();
        localStorage.clear();
        alert("Logged out successfully.");
        navigate("/");
        window.location.reload();
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
            Log Out
        </button>
    );
};

export default LogoutButton;