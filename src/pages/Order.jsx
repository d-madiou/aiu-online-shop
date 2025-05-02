"use client"

import { FaBarcode, FaCheck, FaShippingFast } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const Order = ({ order }) => {
  const navigate = useNavigate()
  const orderNumber = order?.id || Math.floor(10000 + Math.random() * 90000)
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-800 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Order Confirmation</h2>
            <p className="text-sm opacity-90">Thank you for your purchase!</p>
          </div>
          <div className="bg-white text-blue-800 rounded-full p-2">
            <FaCheck size={20} />
          </div>
        </div>

        {/* Order Info */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-bold">#{orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{orderDate}</p>
            </div>
          </div>

          {/* Order Items */}
          <h3 className="font-bold mb-3">Order Summary</h3>
          <div className="space-y-3 mb-6">
            {order.products.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden mr-3">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">RM {(product.price * product.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <p className="text-gray-600">Subtotal</p>
              <p>RM {order.totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-gray-600">Shipping</p>
              <p>Free</p>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-gray-200 mt-2">
              <p>Total</p>
              <p className="text-blue-800">RM {order.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p>
                  {order?.shippingInfo?.firstName
                    ? `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p>{order.paymentMethod || "Cash"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 flex items-center">
                  <FaShippingFast className="mr-2" /> Shipping Address
                </p>
                <p>{order?.shippingInfo?.address || "N/A"}</p>
                {order?.shippingInfo?.exactPlace && <p className="text-sm">{order.shippingInfo.exactPlace}</p>}
              </div>
            </div>
          </div>

          {/* Barcode */}
          <div className="flex justify-center space-x-1 my-6">
            {[...Array(8)].map((_, i) => (
              <FaBarcode key={i} className="text-gray-400" size={24} />
            ))}
          </div>

          {/* Status */}
          <div className="bg-green-500 text-white text-center p-3 rounded-lg font-bold">Order Accepted</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          className="px-5 py-2 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-50"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
        <button
          className="px-5 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
          onClick={() => navigate("/orders")}
        >
          Track Order
        </button>
      </div>
    </div>
  )
}

export default Order
