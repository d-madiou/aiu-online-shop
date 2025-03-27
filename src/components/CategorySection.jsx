import React from 'react';
import ClothImage from '../assets/Images/cloth.jpg';
import DrinkImage from '../assets/Images/drinks.jpg';
import ElectronicImage from '../assets/Images/electronics.jpg';
import FoodImage from '../assets/Images/food.jpg';

const CategorySection = ()=>{
    const itemInfo = [
        {
            name: 'foods',
            imageURL: FoodImage,
        },
        {
            name: 'drinks',
            imageURL: DrinkImage,
        },
        {
            name: 'cloths',
            imageURL: ClothImage,
        },
        {
            name: 'electronics',
            imageURL: ElectronicImage,
        },
    ];

    return (
        <div className="bg-white flex items-start">
        <div className="mx-auto container grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {itemInfo.map((item, index) => (
            <div key={index} className="relative w-[180px] h-[100px] md:w-[280px] md:h-[152px] overflow-hidden bg-gray-100">
              <img
                src={item.imageURL}
                alt={item.name}
                className="w-full h-full object-cover transform transition-transform ease-in-out duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white text-center pointer-events-none">
                <p className="text-sm">SAVE 20%</p>
                <h2 className="text-2xl font-bold">{item.name}</h2>
                <button className="mt-2 px-4 py-2 bg-yellow-500 text-black font-semibold pointer-events-auto">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
      
}

export default CategorySection;