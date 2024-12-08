const supermarkets = [
    {
        id: 1,
        name: "Frugal Foods",
        address: "10 Pavel St",
        coordinate_x: 3,
        coordinate_y: 9,
        image: "https://via.placeholder.com/600x300?text=Frugal+Foods",
        rating: 3.3,
        description: "Affordable groceries and daily needs.",
        categories: generateCategories(1),
    },
    {
        id: 2,
        name: "Healthy Harvest",
        address: "22 Emil St",
        coordinate_x: 7,
        coordinate_y: 13,
        image: "https://via.placeholder.com/600x300?text=Healthy+Harvest",
        rating: 4.7,
        description: "Fresh fruits and vegetables daily.",
        categories: generateCategories(2),
    },
    {
        id: 3,
        name: "MegaMart",
        address: "35 Mert St",
        coordinate_x: 11,
        coordinate_y: 6,
        image: "https://via.placeholder.com/600x300?text=MegaMart",
        rating: 3.8,
        description: "One-stop shop for everything you need.",
        categories: generateCategories(3),
    },
    {
        id: 4,
        name: "Rapid Retail",
        address: "18 Nurridin Ln",
        coordinate_x: 9,
        coordinate_y: 15,
        image: "https://via.placeholder.com/600x300?text=Rapid+Retail",
        rating: 3.9,
        description: "Fast and convenient grocery shopping.",
        categories: generateCategories(4),
    },
    {
        id: 5,
        name: "Garden Grove",
        address: "44 Michael Ave",
        coordinate_x: 5,
        coordinate_y: 14,
        image: "https://via.placeholder.com/600x300?text=Garden+Grove",
        rating: 3.8,
        description: "Organic and sustainable groceries.",
        categories: generateCategories(5),
    },
    {
        id: 6,
        name: "Daily Deals",
        address: "60 Michael Ave",
        coordinate_x: 6,
        coordinate_y: 7,
        image: "https://via.placeholder.com/600x300?text=Daily+Deals",
        rating: 4.2,
        description: "Daily essentials at your convenience.",
        categories: generateCategories(6),
    },
];

function generateCategories(supermarketId) {
    const categoryNames = ["Fruits", "Vegetables", "Snacks", "Dairy", "Beverages"];
    return categoryNames.map((categoryName, categoryIndex) => ({
        name: categoryName,
        items: generateItems(supermarketId, categoryIndex + 1),
    }));
}

function generateItems(supermarketId, categoryId) {
    return Array.from({ length: 15 }, (_, itemIndex) => {
        const id = (supermarketId - 1) * 75 + (categoryId - 1) * 15 + itemIndex + 1; // Unique ID
        return {
            id,
            name: `${categoryId === 1 ? "Fruit" : categoryId === 2 ? "Vegetable" : categoryId === 3 ? "Snack" : categoryId === 4 ? "Dairy" : "Beverage"} ${itemIndex + 1}`,
            price: parseFloat((1.0 + itemIndex * 0.5).toFixed(2)), // Keep price as a number
            description: `High-quality ${categoryId === 1 ? "fruit" : categoryId === 2 ? "vegetable" : categoryId === 3 ? "snack" : categoryId === 4 ? "dairy product" : "beverage"} ${itemIndex + 1}.`,
            image: `https://via.placeholder.com/150x100?text=${categoryId === 1 ? "Fruit" : categoryId === 2 ? "Vegetable" : categoryId === 3 ? "Snack" : categoryId === 4 ? "Dairy" : "Beverage"}+${itemIndex + 1}`,
        };
    });
}

export default supermarkets;
