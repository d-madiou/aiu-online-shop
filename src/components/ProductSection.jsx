import { useEffect, useState } from "react";


const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div>
        <h1 className="text-3xl font-bold text-center mb-6">Shop</h1>
        <div className="flex items-center justify-center">
          <input
            type="text"
            placeholder="Search for a product"
            aria-label="Search for a product"
            className="flex justify-center items-center max-w-sm w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            onChange={(event)=>{
              setSearchProduct(event.target.value);
            }}
          />
        </div>
          <div className="min-h-screen bg-gray-100 p-6">
        
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductSection key={product.id} product={product} />
            ))}
          </div>
        </div>
    </div>
  );
};

export default ProductSection;