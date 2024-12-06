const supermarkets = [
    {
        id: 1,
        name: "SuperMart",
        image: "https://via.placeholder.com/600x300?text=SuperMart",
        rating: 4.5,
        description: "Affordable groceries and daily needs.",
        categories: generateCategories(1),
    },
    {
        id: 2,
        name: "Fresh Market",
        image: "https://via.placeholder.com/600x300?text=Fresh+Market",
        rating: 4.8,
        description: "Fresh fruits and vegetables daily.",
        categories: generateCategories(2),
    },
    {
        id: 3,
        name: "MegaStore",
        image: "https://via.placeholder.com/600x300?text=MegaStore",
        rating: 4.3,
        description: "One-stop shop for everything you need.",
        categories: generateCategories(3),
    },
    {
        id: 4,
        name: "QuickBuy",
        image: "https://via.placeholder.com/600x300?text=QuickBuy",
        rating: 4.7,
        description: "Fast and convenient grocery shopping.",
        categories: generateCategories(4),
    },
    {
        id: 5,
        name: "Green Valley",
        image: "https://via.placeholder.com/600x300?text=Green+Valley",
        rating: 4.6,
        description: "Organic and sustainable groceries.",
        categories: generateCategories(5),
    },
    {
        id: 6,
        name: "Daily Mart",
        image: "https://via.placeholder.com/600x300?text=Daily+Mart",
        rating: 4.4,
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

// function generateItems(supermarketId, categoryId) {
//     return Array.from({ length: 15 }, (_, itemIndex) => {
//         const id = (supermarketId - 1) * 75 + (categoryId - 1) * 15 + itemIndex + 1; // Unique ID
//         return {
//             id,
//             name: `${categoryId === 1 ? "Fruit" : categoryId === 2 ? "Vegetable" : categoryId === 3 ? "Snack" : categoryId === 4 ? "Dairy" : "Beverage"} ${itemIndex + 1}`,
//             price: parseFloat((1.0 + itemIndex * 0.5).toFixed(2)), // Keep price as a number
//             description: `High-quality ${categoryId === 1 ? "fruit" : categoryId === 2 ? "vegetable" : categoryId === 3 ? "snack" : categoryId === 4 ? "dairy product" : "beverage"} ${itemIndex + 1}.`,
//             image: `https://via.placeholder.com/150x100?text=${categoryId === 1 ? "Fruit" : categoryId === 2 ? "Vegetable" : categoryId === 3 ? "Snack" : categoryId === 4 ? "Dairy" : "Beverage"}+${itemIndex + 1}`,
//         };
//     });
// }

function generateItems(supermarketId, categoryId) {
    const categoryFolders = ["Fruits", "Vegetables", "Snacks", "Dairy", "Beverages"];
    const folder = categoryFolders[categoryId - 1].toLowerCase();

    return Array.from({ length: 15 }, (_, itemIndex) => {
        const id = (supermarketId - 1) * 75 + (categoryId - 1) * 15 + itemIndex + 1; // Unique ID
        const itemName = `${folder}-${itemIndex + 1}`; // Construct the file name based on your naming convention

        return {
            id,
            name: capitalizeFirstLetter(folder) + ` ${itemIndex + 1}`,
            price: parseFloat((1.0 + itemIndex * 0.5).toFixed(2)), // Keep price as a number
            description: `High-quality ${folder} product.`,
            image: `/product-images/${folder}/${itemName}.webp`, // Path to the image
        };
    });
}

// Helper function to capitalize the first letter of a word
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export default supermarkets;
