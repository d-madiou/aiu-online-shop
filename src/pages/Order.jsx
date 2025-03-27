import React from 'react';
import { FaBarcode, FaShippingFast } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Order = ({ order }) => {
  const navigate = useNavigate()
  return (
    <div>
      <div className="w-96 mx-auto mt-6 mb-6 bg-gray-100 border border-gray-300  shadow-lg">
        {/* Header */}
        <div className="flex justify-between bg-gray-800 p-4 ">
          <h2 className="text-xl text-white font-semibold">E-mail Receipt</h2>
          <p className="text-white text-sm">Order #09475</p>
        </div>
        <div className="p-6">
          {/* Thank You Message */}
          <h1 className="text-2xl font-bold text-gray-800">Thanks for your Order!</h1>
          <div className="text-sm text-gray-600 mt-2">
            <p>We hope you enjoy your order.</p>
            <p>All of our products are crafted with obsessive attention to detail.</p>
            <p>We would love to hear your feedback!</p>
            <p className="mt-3 pb-3 font-bold border-b border-gray-400">12 February 2025</p>
          </div>
          {/* Order Summary */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            {order.products.map(product => (
              <div className="flex justify-between mt-2">
              <h2 className="text-gray-700">
                {product.name}
              </h2>
              <div className="flex space-x-4 text-gray-700">
                <p>{product.quantity}</p>
                <p>RM{product.price}</p>
              </div>
            </div>
            ))}
      
            <div className="flex justify-between border-b border-gray-400 pb-4 mt-2">
              <h2 className="text-sm font-bold">Total</h2>
              <p className="font-semibold text-gray-800">RM{order.totalPrice}</p>
            </div>
          </div>
          {/* Information Section */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold">Information</h2>
            <div className="flex justify-between mt-2">
              <h2 className="text-gray-700">Client</h2>
              <h2 className="text-gray-800 font-medium">
                {order?.shippingInfo?.firstName
                  ? `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`
                  : 'N/A'}
              </h2>
            </div>
            <div className="flex justify-between mt-2">
              <h2 className="text-gray-700">Payment Method</h2>
              <p className="font-medium text-gray-800">Cash</p>
            </div>
            <div className="flex justify-between mt-2">
              <h2 className="flex items-center text-gray-700">
                Address <FaShippingFast className="text-gray-500 ml-2" />
              </h2>
              <p className="font-semibold text-gray-800">{order?.shippingInfo?.address || '1234, Street'}</p>
            </div>
          </div>
          {/* Barcode */}
          <div className="flex justify-center space-x-2 mt-6">
            <FaBarcode className="text-gray-500" />
            <FaBarcode className="text-gray-500" />
            <FaBarcode className="text-gray-500" />
            <FaBarcode className="text-gray-500" />
            <FaBarcode className="text-gray-500" />
          </div>
          {/* Order Accepted Status */}
          <div className="mt-6 p-3 bg-green-500 text-white text-center font-bold rounded-lg">
             Order Accepted
          </div>
        </div>
      </div>
        <div className='flex m-4 space-x-2 items-center justify-center'>
            <button className='text-blue-600 p-3 outline-1 rounded-2xl hover:cursor-pointer'
            onClick={() => navigate('/')}>Continue Shopping</button>
            <button className='bg-red-500 p-3 rounded-2xl text-white font-bold'>Track delivery</button>
          </div>
    </div>
  );
};

export default Order;
