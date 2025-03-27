import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

function Shop() {
  const products = useSelector((state) => state.product);
  return (
    <div className="container mx-auto py-12" style={{ fontFamily: 'var(--font)' }}>
    <h2 className="text-2xl fond-bold mb-6 text-center">Shop</h2>
    <div className="mx-auto container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.products.slice(0, 10).map(((product) =>(
            <ProductCard product={product}/>
        )))}
    </div>
</div>
  )
}

export default Shop
