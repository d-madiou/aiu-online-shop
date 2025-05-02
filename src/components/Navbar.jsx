import React, { useEffect, useState } from "react";
import {
  FaBars, FaHome, FaOtter, FaPhoneAlt, FaPlus, FaReceipt,
  FaSearch, FaShoppingCart, FaTeamspeak, FaTimes, FaUser
} from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { setSearchTerm } from "../redux/cartSlice";
import { supabase } from "../supabase-client";
import Login from "./login";
import Modal from "./Modal";
import Register from "./register";
import Store from "./Store";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.cart.products);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("login");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [hasStore, setHasStore] = useState(false);

  useEffect(() => {
    const getUserAndStore = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) checkStore(user.id);
    };

    const checkStore = async (userId) => {
      const { data: seller } = await supabase
        .from("sellers")
        .select("store_id")
        .eq("user_id", userId)
        .single();
      setHasStore(!!seller?.store_id);
    };

    getUserAndStore();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) checkStore(currentUser.id);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(search));
    navigate("/filter-data");
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const renderStoreButton = () => {
    if (!user) return (
      <button onClick={() => openModal("login")} className="hidden md:flex items-center bg-red-500 px-4 py-2 rounded-md hover:bg-red-600">
        <FaPlus /> Create a Store
      </button>
    );

    return hasStore ? (
      <Link to="/admin" className="hidden md:flex items-center bg-green-500 px-4 py-2 rounded-md hover:bg-green-600">
        <FaShop className="mr-2" /> My Store
      </Link>
    ) : (
      <button onClick={() => openModal("store")} className="hidden md:flex items-center bg-red-500 px-4 py-2 rounded-md hover:bg-red-600">
        <FaPlus /> Create a Store
      </button>
    );
  };

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-blue-800 shadow-lg text-sm" style={{ fontFamily: 'var(--font)' }}>
        <div className="bg-red-500 text-white py-2.5 px-4 md:px-8 flex justify-between items-center">
          <span className="flex items-center"><FaTeamspeak className="mr-2" size={18} />Terms and condition</span>
          <button className="flex items-center">+6019974584 <FaPhoneAlt className="ml-2" /></button>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <button className="text-white text-2xl md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Link to="/" className="text-xl text-white font-bold md:flex-grow text-center md:text-left hover:text-gray-200">AIU-MARKET</Link>

          {/* <Link to="/admin" className="text-sm text-white font-bold md:flex-grow-0">
            <FaShop size={18} />
          </Link> */}

          <div className="relative hidden md:block w-1/3 mx-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search for a product"
                className="w-full bg-white py-2 px-4 rounded-l-md focus:outline-none"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="bg-red-500 text-white px-4 rounded-r-md hover:bg-red-600">
                <FaSearch />
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-6 text-white">
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-xl" />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {products?.length || 0}
              </span>
            </Link>

            <Link to="/order-confirmation" className="relative">
              <FaReceipt className="text-xl" />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
            </Link>

            {user ? (
              <button onClick={logout} className="hidden md:block bg-yellow-500 text-black py-2 px-4 rounded-md">Logout</button>
            ) : (
              <button onClick={() => openModal("login")} className="hidden md:block">Login | Register</button>
            )}

            {user ? (
              <button onClick={logout} className="block md:hidden bg-yellow-500 text-black py-2 px-4 rounded-md">Logout</button>
            ) : (
              <button onClick={() => openModal("login")} className="block md:hidden">
                <FaUser className="text-xl" />
              </button>
            )}

            {renderStoreButton()}
          </div>
        </div>

        <div className="hidden md:block bg-blue-900">
          <div className="container mx-auto">
            <nav className="flex items-center justify-center space-x-8 text-white py-3">
              <Link to="/" className="flex items-center hover:text-gray-200"><FaHome className="mr-2" /> Home</Link>
              <Link to="/shop" className="flex items-center hover:text-gray-200"><FaShop className="mr-2" /> Shop</Link>
              <Link to="/about" className="flex items-center hover:text-gray-200"><FaUser className="mr-2" /> About</Link>
              <Link to="/others" className="flex items-center hover:text-gray-200"><FaOtter className="mr-2" /> Others</Link>
            </nav>
          </div>
        </div>

        {menuOpen && (
          <div className="bg-blue-700 md:hidden w-full p-4">
            <form className="mb-4" onSubmit={handleSearch}>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white py-2 px-4 rounded-l-md"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="bg-red-500 text-white px-4 rounded-r-md">
                  <FaSearch />
                </button>
              </div>
            </form>
            <nav className="flex flex-col space-y-4 text-white">
              <Link to="/" className="flex items-center py-2 px-3 hover:bg-blue-800 rounded-md" onClick={() => setMenuOpen(false)}>
                <FaHome className="mr-3" /> Home
              </Link>
              <Link to="/shop" className="flex items-center py-2 px-3 hover:bg-blue-800 rounded-md" onClick={() => setMenuOpen(false)}>
                <FaShop className="mr-3" /> Shop
              </Link>
              <Link to="/about" className="flex items-center py-2 px-3 hover:bg-blue-800 rounded-md" onClick={() => setMenuOpen(false)}>
                <FaUser className="mr-3" /> About
              </Link>
              <Link to="/others" className="flex items-center py-2 px-3 hover:bg-blue-800 rounded-md" onClick={() => setMenuOpen(false)}>
                <FaOtter className="mr-3" /> Others
              </Link>
              <button onClick={() => openModal("store")} className="flex items-center bg-red-500 px-4 py-2 rounded-md">
                <FaPlus /> Create a Store
              </button>
            </nav>
          </div>
        )}
      </nav>

      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        {modalContent === "login" && <Login openSignUp={() => openModal("register")} />}
        {modalContent === "register" && <Register openLogin={() => openModal("login")} />}
        {modalContent === "store" && <Store onStoreCreated={() => { setHasStore(true); setIsModalOpen(false); navigate("//admin"); }} />}
      </Modal>
    </div>
  );
};

export default Navbar;
