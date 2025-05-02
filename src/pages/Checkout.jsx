"use client"

import { useState } from "react"
import { FaChevronDown, FaPaypal, FaShippingFast } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase-client"
import Order from "./Order"

const Checkout = ({ products = [], totalPrice = 0, totalQuantity = 0, setOrder, setIsModalOpen }) => {
  const navigate = useNavigate()
  const [showShipping, setShowShipping] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [orderComplete, setOrderComplete] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    blockHostel: "",
    address: "",
    exactPlace: "",
    phone: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    })
  }

  const handleOrder = async () => {
    if (!products.length) return

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      alert("Please log in to place your order.")
      return
    }

    const userId = session.user.id

    try {
      // Insert shipping info
      const { data: shippingData, error: shippingError } = await supabase
        .from("shipping_info")
        .insert([
          {
            user_id: userId,
            first_name: shippingInfo.firstName,
            last_name: shippingInfo.lastName,
            block_hostel: shippingInfo.blockHostel,
            address: shippingInfo.address,
            exact_place: shippingInfo.exactPlace,
            phone: shippingInfo.phone,
          },
        ])
        .select()
        .single()

      if (shippingError) throw shippingError

      // Insert order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userId,
            shipping_info_id: shippingData.id,
            total_price: totalPrice,
            payment_method: paymentMethod || "Paypal",
          },
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Clear cart
      await supabase.from("cart").delete().eq("user_id", userId)

      // Prepare order data
      const fullOrder = {
        id: orderData.id,
        products,
        shippingInfo,
        totalPrice,
        paymentMethod: paymentMethod || "Paypal",
      }

      setOrder(fullOrder)
      setCurrentOrder(fullOrder)
      setOrderComplete(true)
    } catch (error) {
      console.error("Order processing error:", error.message)
      alert(`Order failed: ${error.message}`)
    }
  }

  // Validate form
  const isShippingValid = () => {
    return shippingInfo.firstName && shippingInfo.lastName && shippingInfo.address && shippingInfo.phone
  }

  if (orderComplete && currentOrder) {
    return <Order order={currentOrder} />
  }

  return (
    <div className="bg-white rounded-lg max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left section - Form */}
          <div className="md:col-span-2">
            {/* Shipping Section */}
            <div className="mb-6">
              <div
                className="flex items-center space-x-2 mb-4 cursor-pointer"
                onClick={() => setShowShipping(!showShipping)}
              >
                <div className={`w-4 h-4 rounded-full ${showShipping ? "bg-blue-800" : "border-2 border-gray-300"}`} />
                <h2
                  className={`text-lg flex items-center font-medium ${showShipping ? "text-blue-800" : "text-gray-400"}`}
                >
                  <FaShippingFast className="mr-2" /> Shipping Information
                </h2>
              </div>

              {showShipping && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name*
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="blockHostel" className="block text-sm font-medium text-gray-700 mb-1">
                        Block/Hostel
                      </label>
                      <input
                        type="text"
                        id="blockHostel"
                        name="blockHostel"
                        value={shippingInfo.blockHostel}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address*
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="exactPlace" className="block text-sm font-medium text-gray-700 mb-1">
                        Exact Place
                      </label>
                      <input
                        type="text"
                        id="exactPlace"
                        name="exactPlace"
                        value={shippingInfo.exactPlace}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    className="mt-4 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => {
                      if (isShippingValid()) {
                        setShowShipping(false)
                        setShowPayment(true)
                      } else {
                        alert("Please fill in all required fields")
                      }
                    }}
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div>
              <div
                className="flex items-center space-x-2 mb-4 cursor-pointer"
                onClick={() => setShowPayment(!showPayment)}
              >
                <div className={`w-4 h-4 rounded-full ${showPayment ? "bg-blue-800" : "border-2 border-gray-300"}`} />
                <h2
                  className={`text-lg flex items-center font-medium ${showPayment ? "text-blue-800" : "text-gray-400"}`}
                >
                  <FaPaypal className="mr-2" /> Payment Method
                </h2>
              </div>

              {showPayment && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Payment Method*
                    </label>
                    <div className="relative">
                      <select
                        id="paymentMethod"
                        className="w-full p-2 border border-gray-300 rounded-md bg-white appearance-none focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        value={paymentMethod}
                        required
                      >
                        <option value="">Select Payment Method</option>
                        <option value="QR code">QR code</option>
                        <option value="TouchNgo">TouchNgo</option>
                        <option value="Cash On Delivery">Cash On Delivery</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <FaChevronDown className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <button
                    className="mt-4 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={handleOrder}
                    disabled={!paymentMethod}
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right section - Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="max-h-40 overflow-y-auto mb-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">RM {(product.price * product.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between mb-1">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium">RM {totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-1">
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="text-sm font-medium">Free</p>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
                <p className="font-medium">Total</p>
                <p className="font-bold text-blue-800">RM {totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
