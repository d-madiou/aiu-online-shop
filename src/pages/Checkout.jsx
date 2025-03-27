import React, { useState } from 'react';
import { FaChevronDown, FaPaypal, FaShippingFast } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Checkout = ({setOrder}) => {
  const cart = useSelector(state => state.cart);
  const navigate = useNavigate();
  const [showShipping, setShowShipping] = useState(true);
  const [showPayment, setShowPayment] = useState(false);


  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    exactPlace: '',
    phone: '',
  })

  const handleOrder = () =>{
    if (!cart.products.length) return;  // Ensure there's an order
    const newOrder = {
      products: cart.products,
      shippingInfo: shippingInfo || {}, // Ensure it's not null
      paymentMethod: 'Paypal',
      totalPrice: cart.totalPrice || 0,
    };
    setOrder(newOrder);
    navigate('/order-confirmation');
};

  return (
    <div className='bg-white text-gray-800' style={{fontFamily: 'var(--font)'}}>
      <div className='container mx-auto p-4 md:flex md:space-x-8'>
        {/* Left section */}
        <div className='md:w-2/3'>
          {/* Shipping Section */}
          <div className='mb-8'>
            <div 
              className='flex items-center space-x-2 mb-4 cursor-pointer' 
              onClick={() => setShowShipping(!showShipping)}
            >
              <div className={`w-4 h-4 rounded-full ${showShipping ? 'bg-blue-600' : 'border-2 border-gray-300'}`}></div>
              <h2 className={`text-xl flex font-semibold ${showShipping ? 'text-blue-600' : 'text-gray-400'}`}><FaShippingFast/> - Shipping</h2>
            </div>
            {showShipping && (
              <div>
                <h1 className='text-3xl font-bold mb-6'>Shipping</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  <div>
                    <label className='block text-sm text-gray-500 mb-1'>First Name</label>
                    <input type="text" placeholder='First name'
                    onChange={(e) => setShippingInfo({...shippingInfo, firstName:e.target.value})}
                      className='w-full p-3 border border-gray-300 rounded-lg text-gray-700' />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-500 mb-1' >Last Name</label>
                    <input type="text" placeholder='Last name'
                    onChange={(e) => setShippingInfo({...shippingInfo, lastName:e.target.value})}
                      className='w-full p-3 border border-gray-300 rounded-lg text-gray-700' />
                  </div>
                  <div className='col-span-2'>
                    <label className='block text-sm text-gray-500 mb-1'>Block Hostel</label>
                    <div className='relative'>
                      <select className='w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 appearance-none'
                      onChange={(e) => setShippingInfo({...shippingInfo, blockHostel:e.target.value})}>
                        <option>Select Hostel</option>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                        <option value='Other'>Other</option>
                      </select>
                      <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
                        <FaChevronDown />
                      </div>
                    </div>
                  </div>
                  <div className='col-span-2'>
                    <label className='block text-sm text-gray-500 mb-1'>Address</label>
                    <input type="text" placeholder='Address (room number)'
                    onChange={(e) => setShippingInfo({...shippingInfo, address:e.target.value})}
                      className='w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700' />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-500 mb-1'>Exact Place</label>
                    <input type="text" placeholder='Enter your exact location'
                    onChange={(e) => setShippingInfo({...shippingInfo, exactPlace:e.target.value})}
                      className='w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700' />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-500 mb-1'>Phone Number</label>
                    <input type="number" placeholder='+60-19-459-65'
                    onChange={(e) => setShippingInfo({...shippingInfo, phone:e.target.value})}
                      className='w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700' />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox text-blue-600" />
                    <span className="ml-2 text-gray-700">
                      Use as billing address
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className='grid grid-cols-1 items-center space-x-2'>
            <div 
              className='flex items-center space-x-2 mb-4 cursor-pointer' 
              onClick={() => setShowPayment(!showPayment)}
            >
              <div className={`w-4 h-4 rounded-full ${showPayment ? 'bg-blue-600' : 'border-2 border-gray-300'}`}></div>
              <h2 className={`text-xl flex font-semibold ${showPayment ? 'text-blue-600' : 'text-gray-400'}`}><FaPaypal/> - Payment</h2>
            </div>
            {showPayment && (
              <div>
                <h2 className='text-xl font-semibold text-gray-800'>Payment</h2>
                <div className='relative mt-4'>
                  <select className='w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 appearance-none'>
                    <option>Select Payment Method</option>
                    <option value='QR code'>QR code</option>
                    <option value='TouchNgo'>TouchNgo</option>
                    <option value='Cash On Delivery'>Cash On Delivery</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
                    <FaChevronDown />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className='md:w-1/3 bg-gray-100 p-6 rounded-lg mt-4'>
          <h2 className="text-2xl font-bold mb-6">Summary</h2>
          {cart.products.map((product) => (
            <div key={product.id} className='space-y-4 flex justify-between'>
              <div className="flex items-center justify-between">
                <img src={product.image} alt={product.name} className='w-12 h-12 rounded-lg' />
              </div>
              <div className="">
                <p className='text-gray-700'>{product.name}</p>
                <p className='text-gray-700 font-bold'>RM{product.price}</p>
              </div>
            </div>
          ))}
          <div className="mt-6 border-t border-gray-300 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-semibold">Total</p>
              <p className="text-2xl font-semibold text-blue-600">RM{cart.totalPrice.toFixed(2)}</p>
            </div>
            <p className="text-gray-500 text-sm">Import duties included</p>
          </div>
          <button className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg"
          onClick={() => handleOrder()}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
