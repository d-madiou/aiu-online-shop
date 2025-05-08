import { useEffect, useState } from "react";
import {
  FaBars,
  FaBook,
  FaHome,
  FaPlus,
  FaReceipt,
  FaSearch,
  FaShoppingBag,
  FaSignOutAlt,
  FaTimes,
  FaUser
} from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import logoImage from "../assets/Images/logo.png";
import { setSearchTerm } from "../redux/cartSlice";
import { supabase } from "../supabase-client";
import Login from "./login";
import Modal from "./Modal";
import Register from "./register";
import Store from "./Store";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartProducts = useSelector((state) => state.cart.products);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("login");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [hasStore, setHasStore] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [latestOrderId, setLatestOrderId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const checkStore = async (userId) => {
      const { data: seller } = await supabase
        .from("sellers")
        .select("store_id")
        .eq("user_id", userId)
        .single();
      setHasStore(!!seller?.store_id);
    };

    const fetchOrders = async (userId) => {
      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data.length > 0) {
        setOrderCount(data.length);
        setLatestOrderId(data[0].id);
      } else {
        setOrderCount(0);
        setLatestOrderId(null);
      }
    };

    const fetchCartCount = async (userId) => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("cart")
        .select("quantity")
        .eq("user_id", userId);

      if (!error && data.length > 0) {
        const count = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    };

    const getUserAndStore = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        checkStore(user.id);
        fetchOrders(user.id);
        fetchCartCount(user.id);
      }
    };

    getUserAndStore();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          checkStore(currentUser.id);
          fetchOrders(currentUser.id);
          fetchCartCount(currentUser.id);
        }
      }
    );

    // Handle scroll for navbar appearance
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      listener?.subscription?.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update cart count when Redux cart changes
  useEffect(() => {
    if (cartProducts?.length) {
      const count = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    }
  }, [cartProducts]);

  const handleReceiptClick = () => {
    if (user && latestOrderId) {
      navigate(`/order/${latestOrderId}`);
    } else {
      navigate("/");
      // Handle case when user is not logged in or no orders exist
      if (!user) {
        alert("Please log in to view your orders.");
      }
      if (orderCount === 0) {
        alert("No orders found.");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(setSearchTerm(search));
      navigate("/filter-data");
      setSearchVisible(false);
    }
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
    if (!user)
      return (
        <button
          onClick={() => openModal("login")}
          className="hidden md:flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
        >
          <FaPlus className="mr-2" /> Create Store
        </button>
      );

    return hasStore ? (
      <Link
        to="/admin"
        className="hidden md:flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-md hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md"
      >
        <FaShop className="mr-2" /> My Store
      </Link>
    ) : (
      <button
        onClick={() => openModal("store")}
        className="hidden md:flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
      >
        <FaPlus className="mr-2" /> Create Store
      </button>
    );
  };

  return (
    <div className="sticky top-0 z-50">
      <nav
        className={`backdrop-blur-md bg-white/90 shadow-lg transition-all duration-300 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo and Menu Toggle */}
            <div className="flex items-center">
              <button
                className="text-gray-700 text-xl mr-4 md:hidden focus:outline-none hover:text-indigo-600 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>

              <Link to="/" className="flex items-center group">
                <img
                  src={logoImage || "/placeholder.svg"}
                  alt="AIU Marketplace"
                  className={`transition-all duration-300 ${
                    isScrolled ? "h-8" : "h-10"
                  } w-auto group-hover:scale-105`}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                <FaHome className="mr-2" /> Home
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                <FaShop className="mr-2" /> Shop
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                <FaUser className="mr-2" /> About
              </Link>
              <Link
                to="/others"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                <FaBook className="mr-2" /> Others
              </Link>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop Search */}
              <div className="hidden md:block relative">
                <form 
                  onSubmit={handleSearch} 
                  className={`flex transition-all duration-300 ${searchFocused ? 'ring-2 ring-indigo-300 rounded-md' : ''}`}
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    className={`w-48 lg:w-64 bg-gray-50 py-2 px-4 rounded-l-md focus:outline-none border-0 transition-all duration-300 ${
                      searchFocused ? "w-64 lg:w-80" : ""
                    }`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 rounded-r-md hover:from-indigo-600 hover:to-purple-700 transition-colors duration-200"
                  >
                    <FaSearch />
                  </button>
                </form>
              </div>

              {/* Mobile Search Toggle */}
              <button
                className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                onClick={() => setSearchVisible(!searchVisible)}
                aria-label="Toggle search"
              >
                <FaSearch size={20} />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group"
                aria-label="Shopping cart"
              >
                <FaShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Orders */}
              <button
                onClick={handleReceiptClick}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group"
                aria-label="Orders"
              >
                <FaReceipt size={20} className="group-hover:scale-110 transition-transform" />
                {orderCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {orderCount}
                  </span>
                )}
              </button>

              {/* User Actions */}
              {user ? (
                <div
                  className="relative"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <button className="flex items-center cursor-pointer text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                    <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105">
                      {user.email?.charAt(0).toUpperCase() || <FaUser />}
                    </div>
                  </button>

                  {isHovered && (
                    <div className="absolute right-0 mt-0 w-64 bg-white/90 backdrop-blur-md rounded-lg shadow-xl py-1 z-10 border border-gray-100 overflow-hidden transform transition-all duration-300 scale-in origin-top-right">
                      <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <p className="font-semibold">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Manage your account</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 w-full text-left items-center"
                      >
                        <FaUser className="mr-3 text-indigo-500" /> Profile
                      </Link>
                      <Link
                        to="/order"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 w-full text-left items-center"
                      >
                        <FaReceipt className="mr-3 text-indigo-500" /> My Orders
                      </Link>
                      <button
                        onClick={logout}
                        className="px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left flex items-center"
                      >
                        <FaSignOutAlt className="mr-3" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openModal("login")}
                  className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 flex items-center"
                >
                  <div className="p-1.5 rounded-full hover:bg-indigo-50 transition-colors duration-200">
                    <FaUser size={18} className="md:mr-2" />
                  </div>
                  <span className="hidden md:inline font-medium">Login</span>
                </button>
              )}

              {/* Store Button */}
              {renderStoreButton()}
            </div>
          </div>

          {/* Mobile Search - Conditional */}
          {searchVisible && (
            <div className="md:hidden mt-4 animate-fade-in">
              <form onSubmit={handleSearch} className="flex ring-2 ring-indigo-300 rounded-md overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-gray-50 py-2.5 px-4 focus:outline-none border-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 hover:from-indigo-600 hover:to-purple-700 transition-colors duration-200"
                >
                  <FaSearch />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-lg animate-fade-in">
            <nav className="flex flex-col px-4 py-2">
              <Link
                to="/"
                className="flex items-center py-3 border-b border-gray-100 text-gray-700 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                <FaHome className="mr-3 text-indigo-500" /> Home
              </Link>
              <Link
                to="/shop"
                className="flex items-center py-3 border-b border-gray-100 text-gray-700 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                <FaShop className="mr-3 text-indigo-500" /> Shop
              </Link>
              <Link
                to="/about"
                className="flex items-center py-3 border-b border-gray-100 text-gray-700 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                <FaUser className="mr-3 text-indigo-500" /> About
              </Link>
              <Link
                to="/others"
                className="flex items-center py-3 border-b border-gray-100 text-gray-700 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                <FaBook className="mr-3 text-indigo-500" /> Others
              </Link>
              {!hasStore && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openModal(user ? "store" : "login");
                  }}
                  className="flex items-center py-3 text-indigo-600 font-medium mt-2"
                >
                  <div className="mr-3 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <FaPlus size={12} />
                  </div>
                  Create a Store
                </button>
              )}
              {hasStore && (
                <Link
                  to="/admin"
                  className="flex items-center py-3 text-indigo-600 font-medium mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="mr-3 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                    <FaShop size={12} />
                  </div>
                  My Store
                </Link>
              )}
            </nav>
          </div>
        )}
      </nav>

      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        {modalContent === "login" && <Login openSignUp={() => openModal("register")} />}
        {modalContent === "register" && <Register openLogin={() => openModal("login")} />}
        {modalContent === "store" && (
          <Store
            onStoreCreated={() => {
              setHasStore(true);
              setIsModalOpen(false);
              navigate("/admin");
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Navbar;