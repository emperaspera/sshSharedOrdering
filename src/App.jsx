import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BasketProvider } from "./context/BasketContext";
import LandingPage from "./pages/LandingPage";
import MainScreen from "./pages/MainScreen";
import InventoryScreen from "./pages/InventoryScreen";
import BasketPage from "./pages/BasketPage";
import OrderSuccess from "./pages/OrderSuccess";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TableDeskLoginPage from "./pages/TableDeskLoginPage";
import AccountPage from "./pages/AccountPage";
import ProfileSelectionPage from "./pages/ProfileSelectionPage";
import OrdersPage from "./pages/OrdersPage.jsx";
import CourierOrdersPage from "./pages/CourierOrdersPage.jsx";
import TopUpPage from "./pages/TopUpPage.jsx";
import NotFoundPage from "./pages/NotFoundPage"; // Import the Not Found Page

const App = () => {
    return (
        <BasketProvider>
            <Router>
                <Routes>
                    {/* Landing Page Route */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/courier/orders" element={<CourierOrdersPage />} />
                    {/* Authentication Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/table-desk-login" element={<TableDeskLoginPage />} />
                    <Route path="/household/select-profile" element={<ProfileSelectionPage />} />
                    <Route path="/household/orders" element={<OrdersPage />} />

                    {/* Groceries App Routes */}
                    <Route path="/main" element={<MainScreen />} />
                    <Route path="/main/account" element={<AccountPage />} />
                    <Route path="/main/inventory/:id" element={<InventoryScreen />} />
                    <Route path="/main/basket" element={<BasketPage />} />
                    <Route path="/main/order-success" element={<OrderSuccess />} />
                    <Route path="/top-up" element={<TopUpPage />} />

                    {/* 404 Not Found Route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </BasketProvider>
    );
};

export default App;
