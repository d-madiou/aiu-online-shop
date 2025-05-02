import { useState } from "react";
import { Route, Routes } from "react-router-dom";
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


function App() {
  const[order, setOrder] = useState(null)

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/admin/login" element={<SuperAdmin />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout setOrder={setOrder}/>} />
      <Route path="/order-confirmation" element={<Order order={order}/>} />
      <Route path="/filter-data" element={<FilterData/>} />
    </Routes>
  );
}

export default App;