import React from 'react';

const Category = () => {

    const categories = 
        [
             { name: "Fresh Produce" },
             { name: "Meat & Seafood" },
             { name: "Bakery" },
             { name: "Pantry Staples" },
             { name: "Beverages" },
             { name: "Snacks" },
             { name: "Household Essentials" },
             { name: "Health & Beauty" },
             { name: "Pet Supplies" },
             { name: "Alcohol" },
             { name: "Others" },
           ];

    return (
        <div className="flex item-center justify-center px-4 md:px-6 gap-6 md:gap-14 my-9 md:my-12 overflow-x-auto">  
            {
                categories.map((category, index) => {
                    return (
                <div className="border text-slate-500 cursor-pointer rounded-full items-center flex flex-1 justify-center min-w-[110px] px-3 py-1 text-center" 
                    key={index}>
                        {category.name}
                </div>
                    )
                }
            )
            }
        </div>
    )
};

export default Category;