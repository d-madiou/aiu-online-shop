import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import HeroImage from '../assets/Images/image.png';
import { Categories, mockData } from "../assets/mockData";
import CategorySection from "../components/CategorySection";
import DealCard from "../components/DealCard";
import InfoSection from "../components/infoSection";
import Modal from "../components/Modal";
import ProductCard from "../components/ProductCard";
import SliderImage from "../components/SliderImage";
import Testimonial from "../components/Testimonial";
import { setProducts } from "../redux/productSlice";

const Home = () =>{
    const navigate = useNavigate()

    const dispatch = useDispatch();
    const products = useSelector(state => state.product);
    useEffect(() =>{
        dispatch(setProducts(mockData));
    }, [])

    return(
        <div>
            <Modal/>
            <div className="bg-white mt-2 px-4 md:px-16 lg:px-24 font-light" style={{ fontFamily: 'var(--font)' }}>
                <div className="container mx-auto py-4 flex flex-col md:flex-row">
                    <div className="w-full md:w-3/12">
                            <div className="bg-red-600 text-white text-xs font-bold px-2 py-2.5">Order by Catgories</div>
                            <ul className="space-y-4 bg-gray-100 p-3 border">
                                {Categories.map((category, index) => (
                                    <li key={index} className="flex items-center text-sm font-medium">
                                        <div className="w-2 h-2 border border-red-500 rounded-full mr-2"></div>
                                        {category}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full md:w-9/12 mt-0 h-96 relative">
                           <img src={HeroImage} alt="hero" className="h-full w-full object-cover" />
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center pointer-events-none"></div>
                            <div className="absolute top-16 left-8 ">
                                <p className=" mb-4 text-white">The best online market place</p>
                                <h2 className="text-3xl font-bold text-white">WELCOME TO AIU MARKET PLACE</h2>
                                <p className="text-xl mt-2.5 font-bold text-gray-100">WE ARE HERE TO HELP</p>
                                <button className="bg-blue-800 px-8 py-1.5 text-white mt-4 hover:bg-blue-500
                                transform transition-transform duration-300 hover:scale-105"
                                onClick={() => navigate('/shop')}>SHOP NOW</button>
                        </div>
                    </div>
                </div>
                <InfoSection />
                <CategorySection />
                <div className="container mx-auto py-12">
                    <h2 className="text-2xl fond-bold mb-6 text-center">Fresh Product</h2>
                    <div className="mx-auto container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.products.slice(0, 5).map(((product) =>(
                            <ProductCard key={product.id || index} product={product}/>
                        )))}
                    </div>
                </div>
                <div className="ontainer mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-semibold bg-amber-400 px-2 py-2 hr">
                            Deal of the day
                        </h1>
                        <Link className="text-blue-600 font-semibold" to="/shop">
                            ALL SALE PRODUCTS
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.products.slice(0, 2).map(((product) =>(
                            <DealCard key={product.id || index} product={product}/>
                        )))}
                    </div>
                </div>
                <SliderImage />
                <div className="container mx-auto py-12 -mt-2">
                    <h2 className="text-2xl fond-bold mb-6 text-center">Best Selling</h2>
                    <div className="mx-auto container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.products.slice(0, 5).map(((product) =>(
                            <ProductCard key={product.id || index} product={product}/>
                        )))}
                    </div>
                </div>
               <Testimonial />
            </div>
        </div>

    );
}
export default Home;