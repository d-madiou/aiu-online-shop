import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import FilterData from "./pages/FilterData";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Shop from "./pages/Shop";

function App() {
  const[order, setOrder] = useState(null)

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout setOrder={setOrder}/>} />
      <Route path="/order-confirmation" element={<Order order={order}/>} />
      <Route path="/filter-data" element={<FilterData/>} />
    </Routes>
  );
}

export default App;