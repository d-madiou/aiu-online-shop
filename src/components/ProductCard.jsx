import React from 'react';
import { FaHeart, FaMoneyBillWaveAlt, FaSortAlphaDownAlt, FaStar } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { IoStorefrontSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';


const ProductCard = ({product}) =>{
    const dispatch = useDispatch();
    const handleAddToCart = (e, product)=>{
        e.stopPropagation()
        e.preventDefault()
        dispatch(addToCart(product))
    }
    return (
            <div className="max-w-xs bg-white border border-gray-200 rounded-lg group">
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <span className="bg-green-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">NEW</span>
                        <div className="flex space-x-2">
                            <button className="text-gray-400 opacity-100 lg:hover:text-blue-700 lg:opacity-0 group-hover:opacity-100 lg:transition-opacity lg:duration-300">
                                <FaHeart />
                            </button>
                            <button className="text-gray-400 opacity-100 lg:hover:text-blue-700 lg:opacity-0 group-hover:opacity-100 lg:transition-opacity lg:duration-300">
                                <FaMessage />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                                <FaSortAlphaDownAlt/>
                            </button>
                        </div>
                    </div>
                    <img alt="Laptop displaying Windows 11 screen" className="w-full h-28 object-cover mt-4" height="100" src={product.image} width="200"/>
                    <div className="mt-4">
                        <h3 className="text-gray-500 flex justify-between text-xs uppercase">{product.shop}<IoStorefrontSharp className='relative -bottom-0.5 text-gray-400'/></h3>
                        <h2 className="text-gray-900 text-lg font-semibold hover:cursor-pointer hover:text-blue-800">{product.name}</h2>
                        <div className="flex items-center mt-2">
                            <div className="flex items-center">
                                <FaStar className='text-yellow-400'/>
                                <FaStar className='text-yellow-400'/>
                                <FaStar className='text-yellow-400'/>
                                <FaStar className='text-yellow-400'/>
                            </div>
                        </div>
                        <p className="text-blue-600 flex justify-between text-sxl lowercase font-bold mt-2">{product.price + "RM"}<FaMoneyBillWaveAlt className='relative -bottom-1.5 text-gray-400'/></p>
                        <button className="w-full bg-blue-600 text-white text-sm cursor-pointer font-semibold py-2 rounded-lg mt-1 
                            lg:transform lg:transition-all lg:duration-600 lg:group-hover:translate-y-3 lg:hover:bg-blue-700 
                            opacity-100 lg:opacity-0 group-hover:opacity-100" onClick={(e) => handleAddToCart(e, product)}>
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
    );
}

export default ProductCard;