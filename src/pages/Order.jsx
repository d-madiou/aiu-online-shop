"use client"

import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { FaArrowLeft, FaBox, FaCheck, FaClock, FaTimes, FaTrash, FaTruck, FaShoppingBag } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../supabase-client"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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

      // 1. Fetch order and shipping info
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          shipping_info:shipping_info_id(*)
        `)
        .eq("id", id)
        .single()

      if (orderError) throw orderError

      // 2. Fetch order items
      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          *,
          product:product_id(*)
        `)
        .eq("order_id", id)

      if (itemsError) throw itemsError

      // 3. Fetch user email (from customers or sellers table using user_id from order)
      const { data: user, error: userError } = await supabase
        .from("users") // 👈 adjust this if you have separate `customers` or `sellers` tables
        .select("email")
        .eq("id", orderData.user_id)
        .single()

      if (userError) {
        console.warn("User email not found:", userError.message)
      }

      // 4. Build complete order
      const fullOrder = {
        ...orderData,
        products: orderItems.map((item) => ({
          ...item.product,
          quantity: item.quantity,
        })),
        status: orderData.status || "pending",
        user_email: user?.email || "unknown@example.com"
      }

      setOrder(fullOrder)

      // 5. Call email edge function
      const { data: emailResponse, error: emailError } = await supabase.functions.invoke("resend-email", {
        body: {
          order_id: fullOrder.id,
          customer_name: `${fullOrder.shipping_info.first_name} ${fullOrder.shipping_info.last_name}`,
          email: fullOrder.user_email,
          status: fullOrder.status
        }
      })

      if (emailError) {
        console.error("Edge function error:", emailError)
      } else {
        console.log("Email sent:", emailResponse)
      }

    } catch (err) {
      console.error("Error fetching order:", err)
      setError(err.message)

      // Fallback to demo data
      setOrder({
        id: id || "ORD-" + Math.floor(10000 + Math.random() * 90000),
        created_at: new Date().toISOString(),
        total_price: 249.98,
        payment_method: "Cash On Delivery",
        status: "pending",
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

  // Subscribe to real-time updates
  const orderSubscription = supabase
    .channel(`order-${id}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${id}`
      },
      (payload) => {
        console.log('Order updated:', payload)
        setOrder(prevOrder => {
          if (prevOrder) {
            return {
              ...prevOrder,
              ...payload.new,
              status: payload.new.status || prevOrder.status
            }
          }
          return prevOrder
        })

        const statusInfo = getStatusInfo(payload.new.status)
        toast.info(`Order status updated: ${statusInfo.text}`, {
          position: "top-center",
          autoClose: 5000,
        })
      }
    )
    .subscribe()

  const orderDeletionSubscription = supabase
    .channel(`order-deletion-${id}`)
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${id}`
      },
      (payload) => {
        console.log('Order deleted:', payload)
        toast.info('Order has been removed', {
          position: "top-center",
          autoClose: 3000,
        })
        navigate("/shop", { replace: true, state: { orderDeleted: true } })
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(orderSubscription)
    supabase.removeChannel(orderDeletionSubscription)
  }
}, [id, navigate])


  const handleClearOrder = async () => {
    const orderStatus = order.status.toLowerCase()
    const isCompletedOrder = ["delivered", "declined"].includes(orderStatus)
    
    if (!isCompletedOrder) {
      toast.error("You can only clear completed orders (delivered or declined).", {
        position: "top-center",
        autoClose: 5000,
      })
      return
    }

    const confirmMessage = orderStatus === "delivered" 
      ? "Are you sure you want to clear this delivered order? This will remove it from your order history."
      : "Are you sure you want to permanently delete this declined order? This action cannot be undone."

    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      setIsDeleting(true)

      // Delete order items first (foreign key constraint)
      const { error: itemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", id)
      
      if (itemsError) throw itemsError

      // Delete shipping info if it exists and is linked to this order
      if (order.shipping_info_id) {
        const { error: shippingError } = await supabase
          .from("shipping_info")
          .delete()
          .eq("id", order.shipping_info_id)
        
        if (shippingError) {
          console.warn("Error deleting shipping info:", shippingError)
          // Don't throw here as it's not critical
        }
      }

      // Finally delete the order
      const { error: orderError } = await supabase
        .from("orders")
        .delete()
        .eq("id", id)
      
      if (orderError) throw orderError

      toast.success(
        orderStatus === "delivered" 
          ? "Order cleared successfully!" 
          : "Order deleted successfully!", 
        {
          position: "top-center",
          autoClose: 3000,
        }
      )

      // Navigate away immediately
      navigate("/shop", { replace: true, state: { orderDeleted: true } })
      
    } catch (err) {
      console.error("Error clearing order:", err)
      toast.error("Failed to clear order. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", icon: <FaClock />, text: "Pending Confirmation" }
      case "accepted":
        return { color: "bg-green-100 text-green-800", icon: <FaCheck />, text: "Order Accepted" }
      case "on the way":
        return { color: "bg-blue-100 text-blue-800", icon: <FaTruck />, text: "On The Way" }
      case "delivered":
        return { color: "bg-green-100 text-green-800", icon: <FaBox />, text: "Delivered" }
      case "declined":
        return { color: "bg-red-100 text-red-800", icon: <FaTimes />, text: "Order Declined" }
      default:
        return { color: "bg-gray-100 text-gray-800", icon: <FaBox />, text: status }
    }
  }

  const canClearOrder = () => {
    const status = order?.status.toLowerCase()
    return ["delivered", "declined"].includes(status)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <FaTimes />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO */}
      <Helmet>
        <title>Order #{order.id} | AIU Marketplace</title>
        <meta name="description" content={`View details for order #${order.id} at AIU Marketplace`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          {canClearOrder() && (
            <button
              onClick={handleClearOrder}
              disabled={isDeleting}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 ${
                order.status.toLowerCase() === "delivered"
                  ? "text-blue-600 border-blue-600 hover:bg-blue-50"
                  : "text-red-600 border-red-600 hover:bg-red-50"
              }`}
            >
              {isDeleting ? (
                <>
                  <div className={`animate-spin rounded-full h-4 w-4 border-t-2 mr-2 ${
                    order.status.toLowerCase() === "delivered" ? "border-blue-600" : "border-red-600"
                  }`}></div>
                  {order.status.toLowerCase() === "delivered" ? "Clearing..." : "Deleting..."}
                </>
              ) : (
                <>
                  <FaTrash className="mr-2" /> 
                  {order.status.toLowerCase() === "delivered" ? "Clear Order" : "Delete Order"}
                </>
              )}
            </button>
          )}
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
                <p className="text-blue-100">Placed on {orderDate}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                >
                  {statusInfo.icon}
                  <span className="ml-2">{statusInfo.text}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar for Active Orders */}
          {["accepted", "on the way", "delivered"].includes(order.status.toLowerCase()) && (
            <div className="p-6 bg-blue-50 border-b">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Progress</h3>
              <div className="relative">
                <div className="flex justify-between items-center">
                  {[
                    { label: "Confirmed", icon: <FaCheck />, status: ["accepted", "on the way", "delivered"] },
                    { label: "On The Way", icon: <FaTruck />, status: ["on the way", "delivered"] },
                    { label: "Delivered", icon: <FaBox />, status: ["delivered"] },
                  ].map((step, index) => {
                    const isActive = step.status.includes(order.status.toLowerCase())
                    return (
                      <div key={step.label} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-700">{step.label}</p>
                      </div>
                    )
                  })}
                </div>
                <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 -z-10">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{
                      width:
                        order.status === "accepted"
                          ? "0%"
                          : order.status === "on the way"
                            ? "50%"
                            : order.status === "delivered"
                              ? "100%"
                              : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Order Items</h2>
                <div className="space-y-4">
                  {order.products.map((product) => (
                    <div key={product.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-gray-600">Qty: {product.quantity}</p>
                        <p className="text-blue-600 font-bold">RM {(product.price * product.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Info */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Shipping Information</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Recipient</p>
                        <p className="font-semibold">
                          {order.shipping_info.first_name} {order.shipping_info.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Phone</p>
                        <p className="font-semibold">{order.shipping_info.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600 text-sm">Address</p>
                        <p className="font-semibold">{order.shipping_info.address}</p>
                        {order.shipping_info.exact_place && (
                          <p className="text-gray-600">{order.shipping_info.exact_place}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">RM {order.total_price.toFixed(2)}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div> */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-lg font-bold text-blue-600">RM {order.total_price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded border">
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold">{order.payment_method}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate("/shop")}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <FaShoppingBag className="mr-2" /> Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate("/about")}
                    className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order