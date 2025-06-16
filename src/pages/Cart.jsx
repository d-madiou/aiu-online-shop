"use client"

import { useEffect, useState } from "react"
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import emptyCart from "../assets/Images/emptyCard.png"
import ChangeAddress from "../components/ChangeAddress"
import Modal from "../components/Modal"
import { supabase } from "../supabase-client"
import Checkout from "./Checkout"

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [address, setAddress] = useState("AIU Female Hostel")
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [order, setOrder] = useState(null)
  const [totalShippingCost, setTotalShippingCost] = useState(0)
  const navigate = useNavigate()

  // Fetch cart items from Supabase
  const fetchCart = async () => {
    const user = await supabase.auth.getUser()
    if (!user?.data?.user?.id) return

    // First, get cart items
    const { data: cartData, error: cartError } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.data.user.id)
    
    if (cartError || !cartData) {
      console.error("Error fetching cart:", cartError)
      return
    }

    if (cartData.length === 0) {
      setCartItems([])
      setTotalShippingCost(0)
      return
    }

    // Get product IDs from cart items
    const productIds = cartData.map(item => item.product_id)
    
    // Fetch product details including shipping cost
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, image, category, shipping_cost")
      .in("id", productIds)
    
    if (productsError) {
      console.error("Error fetching products:", productsError)
      return
    }

    // Merge cart items with product details
    const mergedCartItems = cartData.map(cartItem => {
      const product = productsData.find(p => p.id === cartItem.product_id)
      return {
        ...cartItem,
        name: product?.name || cartItem.name || "Unknown Product",
        price: product?.price || cartItem.price || 0,
        image: product?.image || cartItem.image || "",
        category: product?.category || cartItem.category || "",
        shipping_cost: product?.shipping_cost || 0
      }
    })
    
    setCartItems(mergedCartItems)
    
    // Calculate total shipping cost (fixed per product, not multiplied by quantity)
    const shippingTotal = mergedCartItems.reduce((sum, item) => {
      return sum + item.shipping_cost
    }, 0)
    
    setTotalShippingCost(shippingTotal)
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleAddQuantity = async (product) => {
    await supabase.from("cart").update({
      quantity: product.quantity + 1,
    }).eq("id", product.id)
    fetchCart()
  }

  const handleReduceQuantity = async (product) => {
    if (product.quantity === 1) {
      handleRemove(product.id)
      return
    }
    await supabase.from("cart").update({
      quantity: product.quantity - 1,
    }).eq("id", product.id)
    fetchCart()
  }

  const handleRemove = async (id) => {
    await supabase.from("cart").delete().eq("id", id)
    fetchCart()
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const finalTotal = totalPrice + totalShippingCost

  return (
    <div className="container mx-auto py-8 min-h-screen px-4 md:px-8 lg:px-16">
      {cartItems.length > 0 ? (
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <FaShoppingCart className="mr-3 text-blue-800" /> Your Shopping Cart
          </h1>

          <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden md:flex justify-between border-b border-gray-100 bg-gray-50 p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <p className="w-2/5">Product</p>
                  <div className="w-3/5 flex">
                    <p className="w-1/5 text-center">Price</p>
                    <p className="w-1/5 text-center">Quantity</p>
                    <p className="w-1/5 text-center">Shipping</p>
                    <p className="w-1/5 text-center">Subtotal</p>
                    <p className="w-1/5 text-center">Remove</p>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((product) => (
                    <div key={product.id} className="p-4 flex flex-col md:flex-row md:items-center">
                      <div className="flex items-center md:w-2/5 mb-4 md:mb-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                          <p className="text-blue-800 font-medium mt-1 md:hidden">RM {product.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="md:w-3/5 flex flex-col md:flex-row md:items-center">
                        <div className="hidden md:block md:w-1/5 text-center">
                          <p className="text-gray-900 font-medium">RM {product.price.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center justify-between md:justify-center md:w-1/5">
                          <span className="text-sm text-gray-500 mr-2 md:hidden">Quantity:</span>
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                              onClick={() => handleReduceQuantity(product)}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x border-gray-200 min-w-[40px] text-center">
                              {product.quantity}
                            </span>
                            <button
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                              onClick={() => handleAddQuantity(product)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 md:mt-0 md:justify-center md:w-1/5">
                          <span className="text-sm text-gray-500 md:hidden">Shipping:</span>
                          <p className="text-gray-600 text-sm">
                            RM {product.shipping_cost.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 md:mt-0 md:justify-center md:w-1/5">
                          <span className="text-sm text-gray-500 md:hidden">Subtotal:</span>
                          <p className="font-medium text-blue-800">
                            RM {(product.price * product.quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex justify-end mt-3 md:mt-0 md:justify-center md:w-1/5">
                          <button
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                            onClick={() => handleRemove(product.id)}
                            aria-label="Remove item"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-100">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{totalQuantity}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">RM {totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Shipping:</span>
                    <span className="font-medium">RM {totalShippingCost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-bold">Total:</span>
                    <span className="text-xl font-bold text-blue-800">RM {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  className='w-full bg-blue-800 text-white py-2 hover:bg-blue-500'
                  onClick={() => navigate("/checkout", { 
                    state: { 
                      products: cartItems,
                      totalPrice: totalPrice,
                      shippingCost: totalShippingCost,
                      finalTotal: finalTotal,
                      totalQuantity: totalQuantity
                    }
                  })}
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>

          {/* Modals */}
          <Modal isModalOpen={isAddressModalOpen} setIsModalOpen={setIsAddressModalOpen}>
            <ChangeAddress setAddress={setAddress} setIsModalOpen={setIsAddressModalOpen} />
          </Modal>

        </div>
      ) : (
        <div className="flex justify-center flex-col items-center min-h-[300px]">
          <img src={emptyCart} alt="Empty Cart" className="w-80 h-80 object-contain" />
          <p className="text-gray-500 text-lg mt-4">Your cart is empty</p>
          <button 
            className="mt-4 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-500"
            onClick={() => navigate("/")}
          >
            Go to Products
          </button>
        </div>
      )}
    </div>
  )
}

export default Cart