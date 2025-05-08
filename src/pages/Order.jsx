"use client"

import { useEffect, useState } from "react"
import { FaBox, FaCheck, FaClock, FaFileInvoice, FaShippingFast, FaTimes, FaTrash, FaTruck } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../supabase-client"

const Order = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)

        // Fetch the order from Supabase
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            shipping_info:shipping_info_id(*)
          `)
          .eq("id", id)
          .single()

        if (error) throw error

        // Fetch order items
        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select(`
            *,
            product:product_id(*)
          `)
          .eq("order_id", id)

        if (itemsError) throw itemsError

        // Combine order with items
        setOrder({
          ...data,
          products: orderItems.map((item) => ({
            ...item.product,
            quantity: item.quantity,
          })),
          // Default to "pending" if status is not set
          status: data.status || "pending",
        })
      } catch (err) {
        console.error("Error fetching order:", err)
        setError(err.message)

        // For demo purposes, create a mock order if real one can't be fetched
        setOrder({
          id: id || "ORD-" + Math.floor(10000 + Math.random() * 90000),
          created_at: new Date().toISOString(),
          total_price: 249.98,
          payment_method: "Cash On Delivery",
          status: "pending", // or "accepted" or "declined" or "delivered"
          shipping_info: {
            first_name: "John",
            last_name: "Doe",
            address: "AIU Campus, Block B",
            phone: "+60123456789",
          },
          products: [
            {
              id: 1,
              name: "Wireless Headphones",
              price: 129.99,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
            },
            {
              id: 2,
              name: "Smart Watch",
              price: 119.99,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  // Function to completely remove the order from the database
  const handleClearOrder = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this order? This action cannot be undone.")) {
      return
    }

    try {
      setIsDeleting(true)

      // Delete related data in sequence
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id)

      if (itemsError) throw itemsError

      const { error: shippingError } = await supabase
        .from('shipping_info')
        .delete()
        .eq('id', order.shipping_info_id)

      if (shippingError) throw shippingError

      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

      if (orderError) throw orderError

      // Clear local state and redirect
      setOrder(null)
      navigate('/shop', { replace: true, state: { orderDeleted: true } })

    } catch (err) {
      console.error("Error deleting order:", err)
      alert("Failed to delete order: " + err.message)
    } finally {
      setIsDeleting(false)
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

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Error Loading Order</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-red-700 hover:text-red-800 font-medium flex items-center"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }
  // if empty order
  // Check if order is empty or null

  if (!order) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Order Not Found</h3>
          <p>The order you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-700 hover:text-blue-800 font-medium flex items-center"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
      case "on the way":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-blue-100 text-blue-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaClock />
      case "accepted":
        return <FaCheck />
      case "on the way":
        return <FaTruck />
      case "delivered":
        return <FaBox />
      case "declined":
        return <FaTimes />
      default:
        return <FaBox />
    }
  }

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Pending Confirmation"
      case "accepted":
        return "Order Accepted"
      case "on the way":
        return "On The Way"
      case "delivered":
        return "Delivered"
      case "declined":
        return "Order Declined"
      default:
        return status
    }
  }

  // Determine if we should show the delivery tracking section
  const showDeliveryTracking = ["accepted", "on the way", "delivered"].includes(order.status.toLowerCase())

  // Determine if we should show the clear order button
  const showClearButton = order.status.toLowerCase() === "declined"

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-blue-800 hover:underline flex items-center">
          &larr; Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Order Header */}
        <div className="bg-blue-800 text-white p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
              <p className="text-blue-100">Placed on {orderDate}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
              >
                {getStatusIcon(order.status)}
                <span className="ml-2">{getStatusText(order.status)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Content */}
        <div className="p-6">
          {/* Delivery Tracking - Only show for accepted/on the way orders */}
          {showDeliveryTracking && (
            <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <FaTruck className="mr-2 text-blue-800" /> Delivery Status
              </h2>

              <div className="relative">
                {/* Progress bar */}
                <div className="h-1 bg-gray-200 absolute top-5 left-0 right-0 z-0">
                  <div
                    className="h-1 bg-blue-800 absolute top-0 left-0 z-10"
                    style={{
                      width:
                        order.status === "accepted"
                          ? "25%"
                          : order.status === "on the way"
                            ? "75%"
                            : order.status === "delivered"
                              ? "100%"
                              : "0%",
                    }}
                  ></div>
                </div>

                {/* Steps */}
                <div className="flex justify-between relative z-20">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        ["accepted", "on the way", "delivered"].includes(order.status)
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <FaCheck />
                    </div>
                    <p className="mt-2 text-sm text-center">Confirmed</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        ["on the way", "delivered"].includes(order.status)
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <FaTruck />
                    </div>
                    <p className="mt-2 text-sm text-center">On The Way</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.status === "delivered" ? "bg-blue-800 text-white" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <FaBox />
                    </div>
                    <p className="mt-2 text-sm text-center">Delivered</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-blue-800 font-medium">
                  {order.status === "accepted" && "Your order has been confirmed and is being prepared for shipping."}
                  {order.status === "on the way" && "Your order is on the way to your location."}
                  {order.status === "delivered" && "Your order has been delivered. Enjoy!"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Estimated delivery: {new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Clear Order Button - Only show for declined orders */}
          {showClearButton && (
            <div className="mb-8 bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Order Declined</h3>
                  <p className="text-gray-700 text-sm">
                    We're sorry, but your order has been declined by the seller. This could be due to stock
                    unavailability or other issues.
                  </p>
                </div>
                <button
          onClick={handleClearOrder}
          disabled={isDeleting}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Deleting...
            </>
          ) : (
            <>
              <FaTrash className="mr-2" /> Clear Order
            </>
          )}
        </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <FaFileInvoice className="mr-2 text-blue-800" /> Order Summary
                </h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">RM {product.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.quantity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              RM {(product.price * product.quantity).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <FaShippingFast className="mr-2 text-blue-800" /> Shipping Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Recipient</p>
                      <p className="font-medium">
                        {order.shipping_info.first_name} {order.shipping_info.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="font-medium">{order.shipping_info.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p className="font-medium">{order.shipping_info.address}</p>
                      {order.shipping_info.exact_place && (
                        <p className="text-sm text-gray-700">{order.shipping_info.exact_place}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h2 className="text-lg font-bold mb-4">Order Details</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Number</p>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date Placed</p>
                    <p className="font-medium">{orderDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium">{order.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-2">{getStatusText(order.status)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-medium">RM {order.total_price.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-600">Shipping</p>
                      <p className="font-medium">Free</p>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <p className="font-bold">Total</p>
                      <p className="font-bold text-blue-800">RM {order.total_price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full border border-blue-800 text-blue-800 py-2 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
