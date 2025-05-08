"use client"

import { useState } from "react"
import { FaHeart, FaPlus, FaStar } from "react-icons/fa"
import { IoStorefrontSharp } from "react-icons/io5"
import { Link } from "react-router-dom"
import { supabase } from "../supabase-client"; // Your Supabase client

const ProductCard = ({ product, store }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const SUPABASE_STORAGE_URL = "https://jfcryqngtblpjdudbcyn.supabase.co/storage/v1/object/public/store-images/"

  const handleAddToCart = async (e, product) => {
    e.stopPropagation()
    e.preventDefault()
    setIsAddingToCart(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        alert("Please log in to add to cart.")
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

      // Show success feedback
      const originalBgColor = e.target.style.backgroundColor
      e.target.style.backgroundColor = "#10B981" // Green success color
      setTimeout(() => {
        e.target.style.backgroundColor = originalBgColor
      }, 500)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const toggleFavorite = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setIsFavorite(!isFavorite)
  }

  return (
    <div className="bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square bg-gray-100 overflow-hidden ">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Product badges */}
        {(product.isNew || product.discount) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded">NEW</span>
            )}
            {product.discount && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                {product.discount}% OFF
              </span>
            )}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full shadow-sm ${
            isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"
          }`}
          aria-label="Add to wishlist"
        >
          <FaHeart size={12} />
        </button>
      </Link>

      {/* Product Details */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Store info */}
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs text-gray-500 flex items-center truncate max-w-[70%]">
            {store?.image_url ? (
              <Link to={`/store/${store.id}`} className="flex items-center group truncate">
                <img
                  src={`${SUPABASE_STORAGE_URL}${store.image_url}`}
                  alt={store.name}
                  className="w-4 h-4 rounded-full object-cover mr-1"
                />
                <span className="group-hover:text-blue-800 transition-colors duration-200 truncate">{store?.name}</span>
              </Link>
            ) : (
              <span className="flex items-center truncate">
                <IoStorefrontSharp className="mr-1 flex-shrink-0" size={12} />
                <span className="truncate">{store?.name || "AIU Store"}</span>
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < (product.rating || 4) ? "text-yellow-400" : "text-gray-200"} size={10} />
            ))}
          </div>
        </div>

        {/* Product name */}
        <Link to={`/product/${product.id}`} className="group">
          <h2 className="text-sm font-medium text-gray-800 group-hover:text-blue-800 transition-colors duration-200 line-clamp-2 mb-1">
            {product.name}
          </h2>
        </Link>

        {/* Price and add to cart */}
        <div className="flex justify-between items-center mt-auto pt-2">
          <div>
            <span className="text-blue-800 font-bold text-sm">RM {product.price?.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through ml-1">RM {product.oldPrice?.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={(e) => handleAddToCart(e, product)}
            disabled={isAddingToCart}
            className="w-7 h-7 flex items-center justify-center bg-blue-800 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-sm"
            aria-label="Add to cart"
          >
            {isAddingToCart ? (
              <svg
                className="animate-spin h-3 w-3 text-white"
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
              <FaPlus size={12} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
