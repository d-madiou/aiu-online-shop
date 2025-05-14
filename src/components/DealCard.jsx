"use client"

import { useEffect, useState } from "react"
import { FaCartPlus, FaRegClock, FaStar } from "react-icons/fa"
import { Link } from "react-router-dom"
import { supabase } from "../supabase-client"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const DealCard = ({ product }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Set a random end date for the deal (3-7 days from now)
  useEffect(() => {
    const randomDays = Math.floor(Math.random() * 5) + 3
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + randomDays)

    const interval = setInterval(() => {
      const now = new Date()
      const difference = endDate - now

      if (difference <= 0) {
        clearInterval(interval)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Calculate random stock values
  const totalStock = Math.floor(Math.random() * 50) + 10
  const availableStock = Math.floor(Math.random() * totalStock) + 1
  const stockPercentage = (availableStock / totalStock) * 100

  // Calculate original price based on discount
  const discount = product.discount || 20
  const originalPrice = ((product.price * 100) / (100 - discount)).toFixed(2)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please log in to add to cart.", {
          position: "top-center",
          autoClose: 3000,
        })
        setIsAddingToCart(false)
        return
      }

      // Check if the product already exists in the cart
      const { data: existingItem } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single()

      if (existingItem) {
        // Update quantity
        await supabase
          .from("cart")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id)
      } else {
        // Insert new cart item
        await supabase.from("cart").insert([
          {
            user_id: user.id,
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
          },
        ])
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="relative md:w-2/5 overflow-hidden">
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-64 md:h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </Link>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black/40 to-transparent pointer-events-none" />
          <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
            {discount}% OFF
          </span>
        </div>

        {/* Product Details */}
        <div className="md:w-3/5 p-6 flex flex-col">
          <Link to={`/product/${product.id}`} className="group">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-800 transition-colors duration-200 mb-2">
              {product.name}
            </h2>
          </Link>

          {/* Ratings */}
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < (product.rating || 4) ? "text-yellow-400" : "text-gray-200"} />
              ))}
            </div>
            <span className="text-gray-500 text-sm ml-2">({product.reviews || 24} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-gray-500 line-through text-sm">RM {originalPrice}</span>
            <div className="text-blue-800 text-2xl font-bold">RM {product.price}</div>
          </div>

          {/* Stock */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">
                Available: <span className="text-red-600 font-bold">{availableStock}</span> of {totalStock} items
              </span>
              <span className="text-blue-800 font-medium">{Math.round(stockPercentage)}% left</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-800 to-blue-500 h-2 rounded-full"
                style={{ width: `${stockPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-4">
            <div className="flex items-center text-gray-700 mb-2">
              <FaRegClock className="mr-2 text-blue-800" />
              <span className="font-medium">Limited Time Offer</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-blue-800 text-xl font-bold">{timeLeft.days}</div>
                <div className="text-gray-500 text-xs">Days</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-blue-800 text-xl font-bold">{timeLeft.hours}</div>
                <div className="text-gray-500 text-xs">Hours</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-blue-800 text-xl font-bold">{timeLeft.minutes}</div>
                <div className="text-gray-500 text-xs">Mins</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-blue-800 text-xl font-bold">{timeLeft.seconds}</div>
                <div className="text-gray-500 text-xs">Secs</div>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="mt-auto bg-blue-800 hover:bg-blue-700 text-white font-medium rounded-lg py-3 px-6 transition-colors duration-300 flex items-center justify-center"
          >
            {isAddingToCart ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <FaCartPlus className="mr-2" />
            )}
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default DealCard

