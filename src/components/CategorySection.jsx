import { useRef } from "react"
import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"
import ClothImage from "../assets/Images/cloth.jpg"
import DrinkImage from "../assets/Images/drinks.jpg"
import ElectronicImage from "../assets/Images/electronics.jpg"
import FoodImage from "../assets/Images/food.jpg"

const CategorySection = () => {
  const scrollRef = useRef(null)
  
  const categories = [
    {
      name: "Foods",
      imageURL: FoodImage,
      slug: "foods",
    },
    {
      name: "Drinks",
      imageURL: DrinkImage,
      slug: "drinks",
    },
    {
      name: "Clothes",
      imageURL: ClothImage,
      slug: "clothes",
    },
    {
      name: "Electronics",
      imageURL: ElectronicImage,
      slug: "electronics",
    },
  ]

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="h-8 w-1 bg-blue-800 mr-3"></div>
          <h2 className="text-2xl font-bold">Shop by Category</h2>
        </div>
        <button 
          onClick={scrollRight}
          className="hidden md:flex items-center text-blue-800 hover:text-blue-600 font-medium"
        >
          View All <FaArrowRight className="ml-2" />
        </button>
      </div>

      {/* Scrollable container for mobile */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
          <Link 
            to={`/shop?category=${category.slug}`} 
            key={index} 
            className="flex-shrink-0 snap-start w-[280px] md:w-auto"
          >
            <div className="relative rounded-xl overflow-hidden shadow-md group h-64 w-full md:h-72">
              <img
                src={category.imageURL || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col items-center justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-3">{category.name}</h3>

                <span className="px-6 py-2 bg-blue-800 text-white font-medium rounded-md transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700 inline-flex items-center">
                  Shop Now <FaArrowRight className="ml-2" size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile view all button */}
      <div className="flex justify-center mt-4 md:hidden">
        <Link to="/shop" className="text-blue-800 font-medium flex items-center">
          View All Categories <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  )
}

export default CategorySection
