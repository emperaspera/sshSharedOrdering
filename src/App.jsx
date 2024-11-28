import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BasketProvider } from "./context/BasketContext";
import LandingPage from "./pages/LandingPage";
import MainScreen from "./pages/MainScreen";
import InventoryScreen from "./pages/InventoryScreen";
import BasketPage from "./pages/BasketPage";
import OrderSuccess from "./pages/OrderSuccess";

const App = () => {
    return (
        <BasketProvider>
            <Router>
                <Routes>
                    {/* Landing Page Route */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Groceries App Routes */}
                    <Route path="/main" element={<MainScreen />} />
                    <Route path="/main/inventory/:id" element={<InventoryScreen />} />
                    <Route path="/main/basket" element={<BasketPage />} />
                    <Route path="/main/order-success" element={<OrderSuccess />} />
                </Routes>
            </Router>
        </BasketProvider>
    );
};

export default App;
