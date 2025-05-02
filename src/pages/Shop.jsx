import React from 'react';
import { useSelector } from 'react-redux';
import ProductList from '../components/ProductList';

function Shop() {
  const products = useSelector((state) => state.product);
  return (
    <div className="container mx-auto py-12" style={{ fontFamily: 'var(--font)' }}>
    <h2 className="text-2xl fond-bold mb-6 text-center">Shop</h2>
    <ProductList/>
</div>
  )
}

export default Shop
