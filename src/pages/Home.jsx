"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import HeroImage from "../assets/Images/image.png"
import { Categories, mockData } from "../assets/mockData"
import CategorySection from "../components/CategorySection"
import DealCard from "../components/DealCard"
import InfoSection from "../components/infoSection"
import Modal from "../components/Modal"
import ProductList from "../components/ProductList"
import SliderImage from "../components/SliderImage"
import Testimonial from "../components/Testimonial"
import { setProducts } from "../redux/productSlice"

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const products = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(setProducts(mockData))
  }, [dispatch])

  return (
    <div>
      <Modal />
      <div className="bg-white mt-2 px-4 md:px-8 lg:px-16 font-light" style={{ fontFamily: "var(--font)" }}>
        {/* Hero Section */}
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Categories Sidebar */}
            <div className="w-full md:w-3/12">
              <div className="bg-red-600 text-white font-bold px-4 py-3 rounded-t-md">Order by Categories</div>
              <ul className="space-y-3 bg-gray-100 p-4 border rounded-b-md shadow-sm">
                {Categories.map((category, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm font-medium hover:text-red-600 transition duration-200 cursor-pointer"
                  >
                    <div className="w-2 h-2 border border-red-500 rounded-full mr-3"></div>
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hero Banner */}
            <div className="w-full md:w-9/12 h-96 relative rounded-md overflow-hidden shadow-lg">
              <img
                src={HeroImage || "/placeholder.svg"}
                alt="AIU Marketplace"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col items-start justify-center px-8 md:px-12">
                <p className="mb-4 text-white text-sm md:text-base">The best online market place</p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                  WELCOME TO AIU MARKET PLACE
                </h2>
                <p className="text-lg md:text-xl font-bold text-gray-100 mb-6">WE ARE HERE TO HELP</p>
                <button
                  className="bg-blue-800 px-8 py-2.5 text-white rounded-md hover:bg-blue-700
                                    transform transition-all duration-300 hover:scale-105 shadow-md"
                  onClick={() => navigate("/shop")}
                >
                  SHOP NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <InfoSection />

        {/* Category Section */}
        <CategorySection />

        {/* Fresh Products Section */}
        <div className="container mx-auto py-12">
          <div className="flex items-center justify-center mb-8">
            <div className="h-0.5 bg-gray-200 w-1/4"></div>
            <h2 className="text-2xl font-bold mx-4 text-center">Fresh Products</h2>
            <div className="h-0.5 bg-gray-200 w-1/4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              
          </div>
          <ProductList />
        </div>

        {/* Deal of the Day Section */}
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold bg-amber-400 px-4 py-2 rounded-md shadow-sm">Deal of the day</h2>
            <Link className="text-blue-600 font-semibold hover:text-blue-800 transition duration-200" to="/shop">
              ALL SALE PRODUCTS
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.products.slice(0, 2).map((product, index) => (
              <DealCard key={product.id || index} product={product} />
            ))}
          </div>
        </div>

        {/* Slider Image */}
        <SliderImage />

        {/* Best Selling Section */}
        <div className="container mx-auto py-12">
          <div className="flex items-center justify-center mb-8">
            <div className="h-0.5 bg-gray-200 w-1/4"></div>
            <h2 className="text-2xl font-bold mx-4 text-center">Best Selling</h2>
            <div className="h-0.5 bg-gray-200 w-1/4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            
              
            
          </div>
          <ProductList />
        </div>

        {/* Testimonial */}
        <Testimonial />
      </div>
    </div>
  )
}

export default Home
