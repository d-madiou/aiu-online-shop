"use client";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client"; // Your Supabase client

const ProductCard = ({ product, store }) => {
  const SUPABASE_STORAGE_URL =
    "https://jfcryqngtblpjdudbcyn.supabase.co/storage/v1/object/public/store-images/";

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to add to cart.");
      return;
    }

    // Check if the product already exists in the cart
    const { data: existingItem } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single();

    if (existingItem) {
      // Update quantity
      await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("id", existingItem.id);
    } else {
      // Insert new cart item
      await supabase.from("cart").insert([
        {
          user_id: user.id,
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Product Image with Link to Details */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
          NEW
        </span>

        <div className="absolute top-2 right-2 flex flex-col space-y-2">
          <button className="bg-white p-1.5 rounded-full text-gray-500 hover:text-blue-600 transition-colors duration-300 shadow-sm">
            <FaHeart size={14} />
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <div className="text-xs text-gray-500 flex items-center">
            {store?.image_url ? (
              <Link to={`/store/${store.id}`} className="flex items-center">
                <img
                  src={`${SUPABASE_STORAGE_URL}${store.image_url}`}
                  alt={store.name}
                  className="w-6 h-6 rounded-full object-cover mr-2"
                />
                <span className="hover:text-blue-800 transition-colors duration-200">
                  {store.name}
                </span>
              </Link>
            ) : (
              <p className="flex items-center">
                <IoStorefrontSharp className="mr-1" />
                {store?.name || "Unknown Store"}
              </p>
            )}
          </div>
          <div className="flex">
            {[...Array(4)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-xs" />
            ))}
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h2 className="text-gray-900 font-medium line-clamp-2 h-12 hover:text-blue-800 transition-colors duration-200">
            {product.name}
          </h2>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
        </Link>
        <div className="flex justify-between items-center mt-3">
          <p className="text-blue-600 font-bold">{product.price} RM</p>

          <button
            onClick={(e) => handleAddToCart(e, product)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
            aria-label="Add to cart"
          >
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
