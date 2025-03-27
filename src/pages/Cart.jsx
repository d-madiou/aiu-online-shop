import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import emptyCart from '../assets/Images/emptyCard.png';
import ChangeAddress from '../components/ChangeAddress';
import Modal from '../components/Modal';
import { decrementQuantity, incrementQuantity, removeFromCart } from '../redux/cartSlice';

const Cart = () => {
    const cart = useSelector(state => state.cart);
    const [address, setAddress] = useState('AIU Female Hostel');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    
    return (
        <div className='container mx-auto py-8 min-h-96 px-4 md:px-16 lg:px-24'>
            {cart.products.length > 0 ? (
                <div>
                    <h3 className='text-2xl font-semibold mb-4'>Shopping Cart</h3>
                    
                    <div className='flex flex-col md:flex-row md:space-x-10 mt-8'>

                        {/* Cart Items Section */}
                        <div className='md:w-2/3'>
                            <div className='hidden md:flex justify-between border-b items-center mb-4 text-xs font-bold'>
                                <p>PRODUCTS</p>
                                <div className='flex space-x-8'>
                                    <p>PRICE</p>
                                    <p>QUANTITY</p>
                                    <p>SUBTOTAL</p>
                                    <p>REMOVE</p>
                                </div>
                            </div>

                            <div>
                                {cart.products.map((product) => (
                                    <div key={product.id} className='p-3 border-b flex flex-col sm:flex-row items-center sm:justify-between'>
                                        
                                        {/* Product Image and Name */}
                                        <div className='flex items-center space-x-4 w-full sm:w-auto'>
                                            <img src={product.image} alt={product.name} className='w-16 h-16 object-contain rounded' />
                                            <h3 className='text-lg font-semibold'>{product.name}</h3>
                                        </div>

                                        {/* Price, Quantity, and Remove Buttons */}
                                        <div className='grid grid-cols-4 space-x-4 sm:flex sm:items-center sm:space-x-5 w-full sm:w-auto mt-3 sm:mt-0 text-center sm:text-left'>

                                            {/* Price */}
                                            <p className='text-sm sm:text-base'>RM{product.price}</p>

                                            {/* Quantity */}
                                            <div className="flex items-center justify-center sm:border-0 rounded-b-none">
                                                <button 
                                                    className="text-lg font-bold px-2 bg-gray-200 text-red-600"
                                                    onClick={() => dispatch(decrementQuantity(product.id))}
                                                >-</button>
                                                <p className='text-lg px-3 border border-yellow-400'>{product.quantity}</p>
                                                <button 
                                                    className="text-lg px-2 bg-gray-200 text-green-600"
                                                    onClick={() => dispatch(incrementQuantity(product.id))}
                                                >+</button>
                                            </div>

                                            {/* Subtotal */}
                                            <p className='text-sm sm:text-base'>RM{(product.price * product.quantity).toFixed(2)}</p>

                                            {/* Remove Button */}
                                            <button 
                                                className='text-red-500 hover:text-red-700 ml-2 sm:ml-0'
                                                onClick={() => dispatch(removeFromCart(product.id))}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cart Summary Section */}
                        <div className='md:w-1/3 bg-white p-6 rounded-lg shadow-md border mt-6 md:mt-0'>

                            <h3 className='text-sm font-semibold mb-5'>CART TOTAL</h3>

                            <div className='flex justify-between mb-5 border-b pb-1'>
                                <span className='text-sm'>Total Items:</span>
                                <span>{cart.totalQuantity}</span>
                            </div>

                            <div className='mb-4 border-b pb-2'>
                                <p>Shipping:</p>
                                <p className='ml-2'>                    
                                    Shipping to <span className='text-xs font-bold'>{address}</span>
                                </p>
                                <button 
                                    className='text-blue-500 hover:underline mt-1 ml-2'
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Change Address
                                </button>
                            </div>

                            <div className='flex justify-between mb-4'>
                                <span>Total Price:</span>
                                <span>RM{cart.totalPrice.toFixed(2)}</span>
                            </div>

                            <button className='w-full bg-yellow-500 text-white py-2 hover:bg-red-800'
                            onClick={() => navigate("/checkout")}>
                                Proceed to checkout
                            </button>
                        </div>

                    </div>

                    <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
                        <ChangeAddress setAddress={setAddress} setIsModalOpen={setIsModalOpen}/>
                    </Modal>
                </div>
            ) : (
                <div className='flex justify-center'>
                    <img src={emptyCart} alt="Empty Cart" className='h-64 w-auto'/>
                </div>
            )}
        </div>
    )
}

export default Cart;
