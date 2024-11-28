import React, { createContext, useContext, useState } from "react";

// Create the BasketContext
const BasketContext = createContext();

// Hook to access the BasketContext
export const useBasket = () => useContext(BasketContext);

// BasketProvider to wrap the app and provide basket state
export const BasketProvider = ({ children }) => {
    const [basket, setBasket] = useState([]);
    const [lastVisitedSupermarket, setLastVisitedSupermarket] = useState(null); // Track last visited supermarket

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
            }}
        >
            {children}
        </BasketContext.Provider>
    );
};
