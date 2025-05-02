"use client"

import { useEffect } from "react"
import { FaCheck, FaShippingFast, FaTag, FaUndo } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import HeroImage from "../assets/Images/image.png"
import { mockData } from "../assets/mockData"
import CategorySection from "../components/CategorySection"
import DealCard from "../components/DealCard"
import InfoSection from "../components/infoSection"
import Modal from "../components/Modal"
import ProductCard from "../components/ProductCard"
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
      <div className="bg-white font-light" style={{ fontFamily: "var(--font)" }}>
        {/* Hero Section */}
        <div className="relative bg-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src={HeroImage || "/placeholder.svg"} alt="Background" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-2xl">
              <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                SPECIAL OFFERS
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Welcome to AIU Marketplace</h1>
              <p className="text-lg md:text-xl mb-8 text-gray-100">
                Discover amazing products at unbeatable prices. Shop with confidence and enjoy our exclusive deals.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/shop")}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  SHOP NOW
                </button>
                <button
                  onClick={() => navigate("/categories")}
                  className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-3 rounded-md font-semibold transition-all duration-300"
                >
                  BROWSE CATEGORIES
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-800 text-white p-3 rounded-full mb-3">
                  <FaShippingFast size={24} />
                </div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over RM100</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-800 text-white p-3 rounded-full mb-3">
                  <FaUndo size={24} />
                </div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-800 text-white p-3 rounded-full mb-3">
                  <FaTag size={24} />
                </div>
                <h3 className="font-semibold">Best Prices</h3>
                <p className="text-sm text-gray-600">Price match guarantee</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-800 text-white p-3 rounded-full mb-3">
                  <FaCheck size={24} />
                </div>
                <h3 className="font-semibold">Secure Shopping</h3>
                <p className="text-sm text-gray-600">Protected payments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <CategorySection />

        {/* Featured Products */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of top-rated products that our customers love
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.products.slice(0, 5).map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/shop")}
              className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold transition-all duration-300"
            >
              View All Products
            </button>
          </div>
        </div>

        {/* Banner */}
        <div className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">Special Discount This Week</h2>
                <p className="text-gray-300 mb-6">
                  Get up to 50% off on selected items. Limited time offer, don't miss out!
                </p>
                <button
                  onClick={() => navigate("/deals")}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-all duration-300"
                >
                  SHOP THE SALE
                </button>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <div className="text-center">
                    <span className="text-5xl font-bold text-red-600">50%</span>
                    <h3 className="text-2xl font-bold mt-2">DISCOUNT</h3>
                    <p className="text-gray-600 mt-2 mb-4">Use code: SUMMER50</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-gray-100 p-2 rounded">
                        <span className="block text-2xl font-bold">00</span>
                        <span className="text-xs">Days</span>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <span className="block text-2xl font-bold">12</span>
                        <span className="text-xs">Hours</span>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <span className="block text-2xl font-bold">45</span>
                        <span className="text-xs">Mins</span>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <span className="block text-2xl font-bold">30</span>
                        <span className="text-xs">Secs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deal of the Day */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Deal of the Day</h2>
            <div className="w-24 h-1 bg-amber-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Limited time offers at incredible prices. Grab them before they're gone!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.products.slice(0, 2).map((product, index) => (
              <DealCard key={product.id || index} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/shop" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200">
              VIEW ALL SALE PRODUCTS →
            </Link>
          </div>
        </div>

        {/* Slider Image */}
        <SliderImage />

        {/* Best Selling Products */}
        <div className="container mx-auto px-4 py-16 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Best Selling Products</h2>
            <div className="w-24 h-1 bg-blue-800 mx-auto"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Our most popular products based on sales. Updated daily.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.products.slice(0, 5).map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="mb-6">Stay updated with our latest offers, new arrivals, and exclusive discounts.</p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-semibold transition-colors duration-200"
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <Testimonial />

        {/* Info Section */}
        <InfoSection />
      </div>
    </div>
  )
}

export default Home
