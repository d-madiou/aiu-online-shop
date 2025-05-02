import React from 'react';
import { FaBox, FaBuilding, FaShoppingBag, FaTasks } from 'react-icons/fa';

export const Sidebar = ({ active, setActive, sidebarOpen, setSidebarOpen, isSuperAdmin }) => (
  <div className={`w-full md:w-64 bg-blue-800 text-white fixed md:relative ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
    <div className="flex items-center justify-between md:justify-center px-4 py-4 border-b border-blue-300">
      <h1 className="flex items-center text-lg md:text-xl font-bold">
        <FaBuilding/>Dashboard
      </h1>
      <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">✖</button>
    </div>
    <nav className="mt-6">
      {!isSuperAdmin && (
        <>
        <button 
        className={`flex items-center w-full px-4 py-3 ${active === "products" ? "bg-blue-700" : "hover:bg-blue-700"}`} 
        onClick={() => setActive("products")}
      >
        <FaBox className='mr-2' /> Products
      </button>
      <button 
        className={`flex items-center w-full px-4 py-3 ${active === "orders" ? "bg-blue-700" : "hover:bg-blue-700"}`} 
        onClick={() => setActive("orders")}
      >
        <FaShoppingBag className='mr-2' /> Orders
      </button>
      <button 
        className={`flex items-center w-full px-4 py-3 ${active === "superAdmin" ? "bg-blue-700" : "hover:bg-blue-700"}`} 
        onClick={() => setActive("superAdmin")}
      >
        <FaTasks className='mr-2' /> Super Admin
      </button>
      </>
      )}
      
    </nav>
  </div>
);