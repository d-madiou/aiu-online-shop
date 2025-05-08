"use client"

import { useEffect, useState } from "react"
import {
  FaArrowLeft,
  FaChevronRight,
  FaCreditCard,
  FaLock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaQrcode,
  FaShippingFast,
  FaUser,
} from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../supabase-client"

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [products, setProducts] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [loading, setLoading] = useState(true)

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    blockHostel: "",
    address: "",
    exactPlace: "",
    phone: "",
  })

  // Fetch cart items when component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true)
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          navigate("/login")
          return
        }

        const { data: cartItems, error } = await supabase.from("cart").select("*").eq("user_id", user.id)

        if (error) {
          console.error("Error fetching cart:", error)
          return
        }

        if (cartItems.length === 0) {
          navigate("/cart")
          return
        }

        setProducts(cartItems)
        const price = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        setTotalPrice(price)
        const quantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
        setTotalQuantity(quantity)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    })

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      })
    }
  }

  const validateShippingInfo = () => {
    const errors = {}

    if (!shippingInfo.firstName.trim()) errors.firstName = "First name is required"
    if (!shippingInfo.lastName.trim()) errors.lastName = "Last name is required"
    if (!shippingInfo.address.trim()) errors.address = "Address is required"
    if (!shippingInfo.phone.trim()) errors.phone = "Phone number is required"
    else if (!/^\+?[0-9]{10,15}$/.test(shippingInfo.phone.trim())) {
      errors.phone = "Please enter a valid phone number"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePayment = () => {
    if (!paymentMethod) {
      setFormErrors({ paymentMethod: "Please select a payment method" })
      return false
    }
    return true
  }

  const nextStep = () => {
    if (step === 1 && validateShippingInfo()) {
      setStep(2)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setStep(1)
    window.scrollTo(0, 0)
  }

  const handleOrder = async () => {
    if (!validatePayment()) return
    setIsSubmitting(true)

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        alert("Please log in to place your order.")
        setIsSubmitting(false)
        return
      }

      const userId = session.user.id

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
            payment_method: paymentMethod,
            status: "pending",
          },
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Insert order items
      const orderItems = products.map((product) => ({
        order_id: orderData.id,
        product_id: product.product_id || product.id,
        quantity: product.quantity,
        price: product.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      const { error: deleteError } = await supabase.from("cart").delete().eq("user_id", userId)

      if (deleteError) throw deleteError

      // Redirect to order page
      navigate(`/order/${orderData.id}`)
    } catch (error) {
      console.error("Order processing error:", error)
      alert(`Order failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPaymentIcon = (method) => {
    switch (method) {
      case "QR code":
        return <FaQrcode className="mr-3" />
      case "TouchNgo":
        return <FaMoneyBillWave className="mr-3" />
      case "Cash On Delivery":
        return <FaCreditCard className="mr-3" />
      default:
        return <FaCreditCard className="mr-3" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/cart" className="text-blue-800 hover:underline flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Cart
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-800 text-white p-6">
            <h1 className="text-2xl font-bold text-center">Checkout</h1>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-6">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 1 ? "bg-white text-blue-800" : "bg-blue-700 text-white"
                  }`}
                >
                  <FaUser size={14} />
                </div>
                <span className={`ml-2 text-sm ${step >= 1 ? "text-white" : "text-blue-200"}`}>Shipping</span>
              </div>

              <div className={`w-12 h-1 mx-2 ${step >= 2 ? "bg-white" : "bg-blue-700"}`}></div>

              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 2 ? "bg-white text-blue-800" : "bg-blue-700 text-white"
                  }`}
                >
                  <FaCreditCard size={14} />
                </div>
                <span className={`ml-2 text-sm ${step >= 2 ? "text-white" : "text-blue-200"}`}>Payment</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left section - Form */}
              <div className="md:col-span-2">
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <div className="bg-white rounded-lg">
                    <div className="mb-6">
                      <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800">
                        <FaShippingFast className="mr-2 text-blue-800" /> Shipping Information
                      </h2>

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
                            className={`w-full p-2 border ${
                              formErrors.firstName ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                          />
                          {formErrors.firstName && <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>}
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
                            className={`w-full p-2 border ${
                              formErrors.lastName ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                          />
                          {formErrors.lastName && <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>}
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
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number*
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={shippingInfo.phone}
                            onChange={handleInputChange}
                            className={`w-full p-2 border ${
                              formErrors.phone ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                          />
                          {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address*
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={shippingInfo.address}
                            onChange={handleInputChange}
                            className={`w-full p-2 border ${
                              formErrors.address ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                          />
                          {formErrors.address && <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>}
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="exactPlace" className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Address Details
                          </label>
                          <input
                            type="text"
                            id="exactPlace"
                            name="exactPlace"
                            value={shippingInfo.exactPlace}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Apartment, suite, unit, building, floor, etc."
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                          onClick={nextStep}
                        >
                          Continue to Payment <FaChevronRight className="ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                  <div className="bg-white rounded-lg">
                    <div className="mb-6">
                      <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800">
                        <FaCreditCard className="mr-2 text-blue-800" /> Payment Method
                      </h2>

                      <div className="space-y-3 mb-6">
                        <div
                          className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200 bg-white ${
                            paymentMethod === "QR code" ? "border-blue-500 bg-blue-50" : ""
                          }`}
                          onClick={() => setPaymentMethod("QR code")}
                        >
                          <input
                            type="radio"
                            id="qrCode"
                            name="paymentMethod"
                            checked={paymentMethod === "QR code"}
                            onChange={() => setPaymentMethod("QR code")}
                            className="mr-3"
                          />
                          <label htmlFor="qrCode" className="flex items-center cursor-pointer flex-1">
                            <FaQrcode className="mr-3 text-blue-800" />
                            <span>QR Code Payment</span>
                          </label>
                        </div>

                        <div
                          className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200 bg-white ${
                            paymentMethod === "TouchNgo" ? "border-blue-500 bg-blue-50" : ""
                          }`}
                          onClick={() => setPaymentMethod("TouchNgo")}
                        >
                          <input
                            type="radio"
                            id="touchNgo"
                            name="paymentMethod"
                            checked={paymentMethod === "TouchNgo"}
                            onChange={() => setPaymentMethod("TouchNgo")}
                            className="mr-3"
                          />
                          <label htmlFor="touchNgo" className="flex items-center cursor-pointer flex-1">
                            <FaMoneyBillWave className="mr-3 text-blue-800" />
                            <span>Touch 'n Go</span>
                          </label>
                        </div>

                        <div
                          className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200 bg-white ${
                            paymentMethod === "Cash On Delivery" ? "border-blue-500 bg-blue-50" : ""
                          }`}
                          onClick={() => setPaymentMethod("Cash On Delivery")}
                        >
                          <input
                            type="radio"
                            id="cashOnDelivery"
                            name="paymentMethod"
                            checked={paymentMethod === "Cash On Delivery"}
                            onChange={() => setPaymentMethod("Cash On Delivery")}
                            className="mr-3"
                          />
                          <label htmlFor="cashOnDelivery" className="flex items-center cursor-pointer flex-1">
                            <FaCreditCard className="mr-3 text-blue-800" />
                            <span>Cash On Delivery</span>
                          </label>
                        </div>
                      </div>

                      {formErrors.paymentMethod && (
                        <p className="mb-4 text-sm text-red-500">{formErrors.paymentMethod}</p>
                      )}

                      <div className="flex flex-col-reverse sm:flex-row gap-3">
                        <button
                          className="flex-1 border border-blue-800 text-blue-800 py-3 rounded-md hover:bg-blue-50 transition-colors duration-200"
                          onClick={prevStep}
                        >
                          Back to Shipping
                        </button>
                        <button
                          className="flex-1 bg-blue-800 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center disabled:bg-blue-400"
                          onClick={handleOrder}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>Place Order</>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
                      <FaLock className="text-blue-800 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-sm text-gray-700">
                        Your personal data will be used to process your order, support your experience throughout this
                        website, and for other purposes described in our privacy policy.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right section - Order Summary */}
              <div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-6">
                  <h2 className="text-lg font-bold mb-4 pb-3 border-b border-gray-200">Order Summary</h2>

                  {products.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto mb-4 pr-1">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 last:border-0"
                        >
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                              <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                              <p className="text-xs font-medium text-blue-800">RM {product.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">RM {(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">Your cart is empty</div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">Subtotal ({totalQuantity} items)</p>
                      <p className="font-medium">RM {totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">Shipping</p>
                      <p className="font-medium">Free</p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <p className="font-bold">Total</p>
                    <p className="font-bold text-blue-800">RM {totalPrice.toFixed(2)}</p>
                  </div>

                  {step === 2 && paymentMethod && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center">
                        <p className="text-sm text-gray-600">Payment Method:</p>
                        <p className="ml-2 text-sm font-medium flex items-center">
                          {getPaymentIcon(paymentMethod)}
                          {paymentMethod}
                        </p>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-blue-800 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Shipping Address:</p>
                          <p className="text-sm text-gray-600">
                            {shippingInfo.firstName} {shippingInfo.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shippingInfo.address}
                            {shippingInfo.exactPlace && `, ${shippingInfo.exactPlace}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shippingInfo.blockHostel && `${shippingInfo.blockHostel}, `}
                            {shippingInfo.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
