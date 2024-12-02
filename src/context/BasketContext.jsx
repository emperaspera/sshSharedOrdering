import React, { createContext, useContext, useState, useEffect } from "react";

// Create the BasketContext
const BasketContext = createContext();

// Hook to access the BasketContext
export const useBasket = () => useContext(BasketContext);

// BasketProvider to wrap the app and provide basket state
export const BasketProvider = ({ children }) => {
    const [basket, setBasket] = useState(() => {
        // Load basket from localStorage on initial render
        try {
            const savedBasket = localStorage.getItem("basket");
            return savedBasket ? JSON.parse(savedBasket) : [];
        } catch (error) {
            console.error("Error loading basket from localStorage:", error);
            return [];
        }
    });

    const [lastVisitedSupermarket, setLastVisitedSupermarket] = useState(() => {
        try {
            const savedSupermarket = localStorage.getItem("lastVisitedSupermarket");
            return savedSupermarket ? JSON.parse(savedSupermarket) : null;
        } catch (error) {
            console.error("Error loading lastVisitedSupermarket from localStorage:", error);
            return null;
        }
    });

    // Save basket to localStorage whenever it changes
    useEffect(() => {
        try {
            console.log("Saving basket to localStorage:", basket);
            localStorage.setItem("basket", JSON.stringify(basket));
        } catch (error) {
            console.error("Error saving basket to localStorage:", error);
        }
    }, [basket]);

    // Save lastVisitedSupermarket to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem("lastVisitedSupermarket", JSON.stringify(lastVisitedSupermarket));
        } catch (error) {
            console.error("Error saving lastVisitedSupermarket to localStorage:", error);
        }
    }, [lastVisitedSupermarket]);

    const addToBasket = (item, storeId) => {
        setBasket((prev) => {
            const existingItem = prev.find(
                (basketItem) => basketItem.id === item.id && basketItem.storeId === storeId
            );
            if (existingItem) {
                return prev.map((basketItem) =>
                    basketItem.id === item.id && basketItem.storeId === storeId
                        ? { ...basketItem, quantity: basketItem.quantity + 1 }
                        : basketItem
                );
            } else {
                return [...prev, { ...item, quantity: 1, storeId }];
            }
        });
    };

    const removeFromBasket = (itemId) => {
        setBasket((prev) => prev.filter((basketItem) => basketItem.id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        setBasket((prev) =>
            quantity <= 0
                ? prev.filter((basketItem) => basketItem.id !== itemId)
                : prev.map((basketItem) =>
                    basketItem.id === itemId ? { ...basketItem, quantity } : basketItem
                )
        );
    };

    const clearBasket = () => {
        setBasket([]);
    };

    const placeOrder = async (orderDetails) => {
        try {
            const response = await fetch("http://localhost:5000/api/place-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderDetails),
            });

            if (!response.ok) {
                console.error("Failed to place order:", response.status, response.statusText);
                return false;
            }

            console.log("Order placed successfully:", await response.json());
            return true;
        } catch (error) {
            console.error("Error placing order:", error);
            return false;
        }
    };

    return (
        <BasketContext.Provider
            value={{
                basket,
                addToBasket,
                removeFromBasket,
                updateQuantity,
                clearBasket,
                lastVisitedSupermarket,
                setLastVisitedSupermarket,
                placeOrder,
            }}
        >
            {children}
        </BasketContext.Provider>
    );
};