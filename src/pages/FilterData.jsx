import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

const FilterData = () => {
    const filterProducts = useSelector((state) => state.cart.filteredProduct); // Corrected state selection

    return (
        <div className="container mx-auto py-12" style={{ fontFamily: 'var(--font)' }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Shop</h2>
            <div className="mx-auto container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filterProducts.slice(0, 10).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default FilterData;
