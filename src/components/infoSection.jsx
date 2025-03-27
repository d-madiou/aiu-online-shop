import { FaHeadset, FaShippingFast, FaTag } from 'react-icons/fa';
import { FaLocationPinLock, FaMoneyBill1Wave } from 'react-icons/fa6';


const InfoSection = ()=>{
    const infoItems = [
        {
            icon: <FaShippingFast className="text-3xl text-red-600"/>,
            title: "Free Shipping",
            text: "On all orders over $50",
        },
        {
            icon: <FaHeadset className='text-3xl text-red-600'/>,
            title: "24/7 Support",
            text: "We're here to help you",
        },
        {
            icon:<FaMoneyBill1Wave className='text-3xl text-red-600'/>,
            title: "Money Back Guarantee",
            text: "If you're not satisfied, we'll refund you",
        },
        {
            icon: <FaLocationPinLock className='text-3xl text-red-600'/>,
            title: "Secure Payment",
            text: "Your information is safe with us",
        },
        {
            icon: <FaTag className='text-3xl text-red-600'/>,
            title: "Quality Guarantee",
            text: "We stand behind the quality of our products",
        },
    ];
    return(
        <div className='bg-white pb-8 pt-2 flex items-center'>
            <div className='container mx-auto grid grid-cols-5 md:grid-cols-2 lg:grid-cols-5 gap-4 '>
                {infoItems.map((item, index) =>(
                    <div key={index} className='flex flex-col items-center text-center p-4 border rounded-lg shadow
                    transform transition-transform duration-300 hover:scale-105 cursor-pointer'>
                        {item.icon}
                        <h3 className='hidden md:mt-4 md:text-xl md:block font-semibold'>{item.title}</h3>
                        <p className='mt-2 text-gray-600 hidden hover:opacity-100'>{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InfoSection;