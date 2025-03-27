import React from 'react';
import { FaStar } from 'react-icons/fa';


const DealCard = ({product})=>{
  return (
    <div className='bg-white border border-blue-300 p-4 rounded-lg transform transition-transform ease-in-out duration-300 hover:scale-95'>
       <div className='flex'>
        <div className='relative w-1/3'>
         <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>
            {product.discount}% 
         </span>
         <img src={product.image} alt="first image" className='w-full h-auto' height='150' width='150' />
        </div>
        <div className='w-2/3 pl-4'>
            <h2 className='text-lg font-semibold'>{product.name}</h2>
            <div className='flex items-center mb-2'>
                <div className='flex text-yellow-400'>
                    <FaStar className='text-yellow-400'/>
                    <FaStar className='text-yellow-400'/>
                    <FaStar className='text-yellow-400'/>
                    <FaStar className='text-yellow-400'/>
                </div>
            </div>
            <div className='text-gray-500 line-through'>
                12rm
            </div>
            <div className='text-blue-600 text-xl font-bold'>
                {product.price}rm
            </div>
            <div className='mt-2'>
                <span className='text-gray-700'>Available <span className='text-red-600 font-bold'>24</span> items</span>
                <div className='w-full bg-gray-200 rounded-full h-2.5 mt-1'>
                    <div className='bg-green-500 h-2.5 rounded-full w-35 lg:w-70 '>
                    </div>
                </div>
            </div>
            <div className='container mx-auto grid-cols-2 lg:flex lg:space-x-2 space-y-1 mt-2'>
                <div className='bg-red-100 text-red-600 font-bold px-2 py-1 rounded'>35 Days</div>
                <div className="bg-red-100 text-red-600 font-bold px-2 py-1 rounded"> 06 Hrs</div>
                <div className="bg-red-100 text-red-600 font-bold px-2 py-1 rounded"> 12 Min</div>
                <div className="bg-red-100 text-red-600 font-bold px-2 py-1 rounded"> 02 Sec</div>
            </div>
            <button className="mt-4 bg-blue-600 text-white font-bold rounded py-2 px-4"> Add to Cart</button>
         </div>
       </div>
    </div>
  )
}

export default DealCard;
