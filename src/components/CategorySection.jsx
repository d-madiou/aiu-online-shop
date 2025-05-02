import ClothImage from "../assets/Images/cloth.jpg"
import DrinkImage from "../assets/Images/drinks.jpg"
import ElectronicImage from "../assets/Images/electronics.jpg"
import FoodImage from "../assets/Images/food.jpg"

const CategorySection = () => {
  const categories = [
    {
      name: "Foods",
      imageURL: FoodImage,
      discount: "20%",
    },
    {
      name: "Drinks",
      imageURL: DrinkImage,
      discount: "20%",
    },
    {
      name: "Clothes",
      imageURL: ClothImage,
      discount: "20%",
    },
    {
      name: "Electronics",
      imageURL: ElectronicImage,
      discount: "20%",
    },
  ]

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center justify-center mb-8">
        <div className="h-0.5 bg-gray-200 w-1/4"></div>
        <h2 className="text-2xl font-bold mx-4 text-center">Shop by Category</h2>
        <div className="h-0.5 bg-gray-200 w-1/4"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden shadow-md group h-64">
            <img
              src={category.imageURL || "/placeholder.svg"}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col items-center justify-end p-6 text-white">
              <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                SAVE {category.discount}
              </div>

              <h3 className="text-2xl font-bold mb-3 uppercase">{category.name}</h3>

              <button className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-md transform transition-transform duration-300 hover:scale-105 hover:bg-yellow-400">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategorySection
