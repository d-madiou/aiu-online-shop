"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase-client';
import ProductCard from './ProductCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductsWithStores = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select(`
                        *,
                        stores!store_id (
                            id,
                            name,
                            image_url,
                            created_at
                        )
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                
                setProducts(data || []);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsWithStores();
    }, []);

    if (loading) {
        return <div className="p-4 text-gray-500">Loading products...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error loading products: {error.message}</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {products.map((product) => (
                <ProductCard 
                    key={product.id} 
                    product={product}
                    store={product.stores}  // Corrected from storez to stores
                />
            ))}
        </div>
    );
};

export default ProductList;