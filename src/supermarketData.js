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
        items: generateItems(supermarketId, categoryIndex + 1, categoryName),
    }));
}

function generateItems(supermarketId, categoryId, categoryName) {
    const folder = categoryName.toLowerCase(); // Matches folder names in `public/product-images`

    // Define actual filenames for each category
    const fileNames = {
        fruits: [
            "apple.webp", "banana.webp", "blueberries.webp", "grapes.webp",
            "kiwi.webp", "lemon.webp", "lime.webp", "mango.webp",
            "orange.webp", "peach.webp", "pear.webp", "pineapple.webp",
            "pomegranate.webp", "strawberries.webp", "watermelon.webp",
        ],
        beverages: [
            "beverage-energy.webp", "beverage-sports.webp", "cola.webp",
            "iced-coffee.webp", "iced-tea-green.webp", "iced-tea-peach.webp",
            "juice-apple.webp", "juice-carrot.webp", "juice-orange.webp",
            "juice-pineapple.webp", "lemonade.webp", "milkshake.webp",
            "smoothie.webp", "water.webp", "water-sparkling.webp",
        ],
        dairy: [
            "butter.webp", "cheese-cheddar.webp", "cheese-cottage.webp",
            "cheese-cream.webp", "cheese-goat.webp", "cheese-mozzarella.webp",
            "cheese-parmesan.webp", "ice-cream.webp", "kefir.webp",
            "milk.webp", "milk-condenced.webp", "sour-cream.webp",
            "whipped-cream.webp", "yogurt-greek.webp", "yogurt-plain.webp",
        ],
        snacks: [
            "cheese-crackers.webp", "choc-chip-cookies.webp", "corn-chips.webp",
            "fruit-leather.webp", "granola-bars.webp", "mixed-nuts.webp",
            "oatmeal-cookies.webp", "pb-crackers.webp", "plain-chips.webp",
            "popcorn.webp", "rice-cakes.webp", "salted-pretzels.webp",
            "sesame-sticks.webp", "trail-mix.webp", "vegetable-chips.webp",
        ],
        vegetables: [
            "bell-pepper.webp", "broccoli.webp", "cabbage.webp", "carrot.webp",
            "cauliflower.jpg", "corn.webp", "cucumber.webp", "garlic.webp",
            "green-beans.webp", "onion.webp", "potato.webp", "spinach.webp",
            "sweet-potato.webp", "tomato.webp", "zucchini.webp",
        ],
    };

    return fileNames[folder]?.map((fileName, itemIndex) => {
        const id = (supermarketId - 1) * 75 + (categoryId - 1) * 15 + itemIndex + 1; // Unique ID
        const itemName = fileName.split(".")[0]; // Use filename without extension as the item name
        return {
            id,
            name: capitalizeFirstLetter(itemName.replace(/-/g, " ")), // Make the name more readable
            price: parseFloat((1.0 + itemIndex * 0.5).toFixed(2)), // Example pricing logic
            description: `High-quality ${folder} product.`,
            image: `/public/product-images/${folder}/${fileName}`, // Correct image path
        };
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default supermarkets;
