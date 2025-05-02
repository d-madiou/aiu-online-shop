"use client"

import { useEffect, useState } from "react"
import { FaArrowLeft, FaEnvelope, FaShoppingCart } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../supabase-client"

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

        if (error) {
          setError(error)
        } else {
          setProduct(data)
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
  
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()
  
    if (sessionError || !session) {
      alert("You must be logged in to add items to your cart.")
      return
    }
  
    const userId = session.user.id
  
    const { data, error } = await supabase
      .from("cart")
      .upsert(
        {
          user_id: userId,
          product_id: product.id,
          quantity,
          price: product.price,
          name: product.name,
          image: product.image,
        },
        { onConflict: ["user_id", "product_id"] }
      )
  
    if (error) {
      console.error("Error adding to cart:", error.message)
      alert("Failed to add product to cart.")
    } else {
      alert("Product added to cart!")
      // Optionally dispatch to Redux if you want local state sync:
      dispatch(addToCart({ ...product, quantity }))
    }
  }
  

  const handleContactSeller = () => {
    // This would typically open a contact form or chat
    alert(`Contact the seller about: ${product?.name}`)
  }

  const incrementQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="bg-gray-200 h-80 w-full rounded-lg mb-4"></div>
            </div>
            <div className="md:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Error Loading Product</h3>
          <p>{error.message || "There was a problem loading this product."}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-red-700 hover:text-red-800 font-medium flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    )
  }

  // Product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Product Not Found</h3>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-700 hover:text-blue-800 font-medium flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-800 mb-6 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to products
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2 p-6">
            {product.image ? (
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-auto object-contain rounded-lg max-h-96"
              />
            ) : (
              <div className="bg-gray-100 w-full h-80 flex items-center justify-center rounded-lg">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6 border-t md:border-t-0 md:border-l border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <span className="text-blue-800 text-2xl font-bold">RM {product.price}</span>
              {product.quantity > 0 ? (
                <span className="ml-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">In Stock</span>
              ) : (
                <span className="ml-4 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Out of Stock</span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
              <p className="text-gray-800">{product.category}</p>
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-800">{product.description}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Available Quantity</h3>
              <p className="text-gray-800">{product.quantity} units</p>
            </div>

            {/* Quantity Selector */}
            {product.quantity > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-1 px-3 rounded-l"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border-t border-b border-gray-200 py-1"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-1 px-3 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity <= 0}
                className={`flex-1 py-2 px-4 rounded-md font-medium flex items-center justify-center ${
                  product.quantity > 0
                    ? "bg-blue-800 hover:bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button
                onClick={handleContactSeller}
                className="flex-1 py-2 px-4 border border-blue-800 text-blue-800 rounded-md font-medium hover:bg-blue-50 flex items-center justify-center"
              >
                <FaEnvelope className="mr-2" /> Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
