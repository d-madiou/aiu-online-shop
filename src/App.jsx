import React, { useEffect } from "react"; // Added React import for useEffect
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import FilterData from "./pages/FilterData";
import Home from "./pages/Home";
import Order from "./pages/Order";
import ProductDetails from "./pages/ProductDetails";
import Shop from "./pages/Shop";
import SuperAdmin from "./pages/SuperAdmin";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on route change
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop /> {/* Moved outside of Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/filter-data" element={<FilterData />} />
      </Routes>
    </>
  );
}

export default App;