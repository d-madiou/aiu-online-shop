import React, { useState } from "react";
import {
    FaBars, FaHome, FaOtter, FaPhoneAlt, FaReceipt,
    FaSearch, FaShoppingCart, FaTeamspeak, FaTimes, FaUser
} from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { setSearchTerm } from "../redux/cartSlice";
import Login from "./login";
import Modal from "./Modal";
import Register from "./register";

const Navbar = () => {
    const products = useSelector((state) => state.cart.products);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Fixed typo

    const [menuOpen, setMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [search, setSearch] = useState(""); // Initialized properly

    const openSignUp = () => {
        setIsLogin(false);
        setIsModalOpen(true);
    };

    const openLogin = () => {
        setIsLogin(true);
        setIsModalOpen(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setSearchTerm(search));
        navigate("/filter-data"); // Fixed navigation issue
    };

    const handleMenuClose = () => setMenuOpen(false);

    return (
        <div>
            <nav className="bg-blue-800 shadow-md text-xs pb-4" style={{ fontFamily: 'var(--font)' }}>
                {/* Top Banner */}
                <div className="bg-red-500 text-white text-center py-2 text-sm flex justify-between px-4">
                    <span className="flex"><FaTeamspeak className="mr-4"/>Terms and condition</span>
                    <button className="text-white flex space-x-4">
                        +6019974584 <FaPhoneAlt className="ml-4"/>
                    </button>
                </div>
            
                {/* Navbar */}
                <div className="container mx-auto px-4 md:px-16 lg:px-24 py-4 flex justify-between items-center">
                    {/* Mobile Menu Button */}
                    <button className="text-white text-2xl md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
            
                    {/* Website Name */}
                    <div className="text-lg text-white font-bold md:flex-grow text-center md:text-left">
                        <Link to="/">AIU-MARKET</Link>
                    </div>
            
                    {/* Search Bar */}
                    <div className="relative hidden md:block w-2xl mx-4">
                        <form onSubmit={handleSearch}>
                            <input 
                                type="text" 
                                placeholder="Search for a product"
                                className="w-full bg-white py-2 px-4 focus:outline-0 border-0"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <FaSearch className="absolute text-black top-3 right-3 cursor-pointer" onClick={handleSearch}/>
                        </form>
                    </div>
            
                    {/* Icons */}
                    <div className="flex items-center space-x-4 text-white">
                        <Link to="/cart" className="relative">
                            <FaShoppingCart className="text-xl" />
                            <span className="absolute -top-1 -right-3 bg-red-500 text-white rounded-full px-1.5 text-xs">
                                {products.length > 0 ? products.length : 0}
                            </span>
                        </Link>
                        <Link to="/order-confirmation" className="relative">
                            <FaReceipt className="text-xl" />
                            <span className="absolute -top-1 -right-3 bg-red-500 text-white rounded-full px-1.5 text-xs">
                                0
                            </span>
                        </Link>
                        <button className="hidden md:block" onClick={() => setIsModalOpen(true)}>Login | Register</button>
                        <button className="block md:hidden">
                            <FaUser className="text-xl space-x-1" onClick={() => setIsModalOpen(true)}/>
                        </button>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex md:items-center md:justify-center md:space-x-5 text-white">
                    <Link to="/" className="hover:underline flex space-x-4"> <FaHome className="mr-2"/> Home</Link>
                    <Link to="/shop" className="hover:underline flex space-x-4"> <FaShop className="mr-2"/>Shop</Link>
                    <Link to="/about" className="hover:underline flex space-x-4"> <FaUser className="mr-2"/>About</Link>
                    <Link to="/others" className="hover:underline flex space-x-4"> <FaOtter className="mr-2"/>Others</Link>
                </nav>

                {/* Mobile Navigation */}
                <div className={`${menuOpen ? 'block' : 'hidden'} bg-blue-700 md:hidden w-full p-4`}>
                    <form className="relative mb-4" onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-full bg-white py-2 px-4" 
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <FaSearch className="absolute text-black top-3 right-3 cursor-pointer" onClick={handleSearch}/>
                    </form>
                    <nav className="flex flex-col space-y-3 text-white">
                        <Link to="/" className="hover:underline" onClick={handleMenuClose}>Home</Link>
                        <Link to="/shop" className="hover:underline" onClick={handleMenuClose}>Shop</Link>
                        <Link to="/about" className="hover:underline" onClick={handleMenuClose}>About</Link>
                        <Link to="/others" className="hover:underline" onClick={handleMenuClose}>Others</Link>
                    </nav>
                </div>
            </nav>
            <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
                {isLogin ? <Login openSignUp={openSignUp}/> : <Register openLogin={openLogin}/>}
            </Modal>
        </div>
    );
};

export default Navbar;