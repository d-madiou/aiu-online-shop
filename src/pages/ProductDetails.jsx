"use client"

import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import {
  FaArrowLeft,
  FaShoppingCart,
  FaPhone,
  FaShare,
  FaWhatsapp,
  FaTelegram,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaCopy,
  FaTimes,
  FaStar,
  FaHeart,
} from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../supabase-client"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

        if (error) {
          setError(error)
        } else {
          setProduct(data)
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      toast.error("Please log in to add to cart.", {
        position: "top-center",
        autoClose: 3000,
      })
      return
    }

    const userId = session.user.id

    const { data, error } = await supabase.from("cart").upsert(
      {
        user_id: userId,
        product_id: product.id,
        quantity,
        price: product.price,
        name: product.name,
        image: product.image,
      },
      { onConflict: ["user_id", "product_id"] },
    )

    if (error) {
      console.error("Error adding to cart:", error.message)
      toast.error("Error adding to cart. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      })
    } else {
      dispatch(addToCart({ ...product, quantity }))
      toast.success("Added to cart!", {
        position: "top-center",
        autoClose: 3000,
      })
    }
  }

  const handleContactSeller = async (method) => {
  try {
    // Fetch store data from Supabase using the product's store_id
    const { data: storeData, error } = await supabase
      .from('stores')
      .select('phone_number')
      .eq('id', product.store_id)
      .single();

    if (error) throw error;

    // Use store's phone number or fallback to default
    const phone = storeData?.phone_number || "+60123456789";
    const message = `Hello! I'm interested in your product: ${product.name}`;

    switch (method) {
      case "whatsapp":
        window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
        break;
      case "telegram":
        window.open(`https://t.me/${phone.replace(/\D/g, "")}`, "_blank");
        break;
      case "email":
        // If you want to fetch seller email too, you would need to join with sellers table
        window.open(
          `mailto:seller@aiumarketplace.com?subject=Inquiry about ${product.name}&body=${encodeURIComponent(message)}`,
        );
        break;
      case "phone":
        window.open(`tel:${phone}`);
        break;
      default:
        break;
    }
    setShowContactModal(false);
  } catch (error) {
    console.error("Error fetching store data:", error);
    // Fallback to default contact methods
    const phone = "+60123456789";
    const message = `Hello! I'm interested in your product: ${product.name}`;
    
    // Same switch case logic as above with fallback values
    switch (method) {
      case "whatsapp":
        window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
        break;
      case "telegram":
        window.open(`https://t.me/${phone.replace(/\D/g, "")}`, "_blank");
        break;
      case "email":
        window.open(
          `mailto:seller@aiumarketplace.com?subject=Inquiry about ${product.name}&body=${encodeURIComponent(message)}`,
        );
        break;
      case "phone":
        window.open(`tel:${phone}`);
        break;
      default:
        break;
    }
    setShowContactModal(false);
  }
};

  const handleShare = (method) => {
    const url = window.location.href
    const text = `Check out this amazing product: ${product.name} at AIU Marketplace`

    switch (method) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        )
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank")
        break
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!", {
          position: "top-center",
          autoClose: 2000,
        })
        break
      default:
        break
    }
    setShowShareModal(false)
  }

  const incrementQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites", {
      position: "top-center",
      autoClose: 2000,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <FaTimes />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h3>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO */}
      <Helmet>
        <title>{product.name} | AIU Marketplace</title>
        <meta name="description" content={product.description || `Buy ${product.name} at AIU Marketplace`} />
        <meta name="keywords" content={`${product.name}, ${product.category}, AIU marketplace, buy online`} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description || `Buy ${product.name} at AIU Marketplace`} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to products
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleFavorite}
              className={`p-3 rounded-full border-2 transition-colors ${
                isFavorite
                  ? "bg-red-500 border-red-500 text-white"
                  : "bg-white border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
              }`}
            >
              <FaHeart />
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaShare className="mr-2" /> Share
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>No image available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                    <span className="ml-2 text-gray-600">(24 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-blue-600">RM {product.price}</span>
                {product.quantity > 0 ? (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">In Stock</span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">Out of Stock</span>
                )}
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Category</h4>
                  <p className="text-gray-600">{product.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Available</h4>
                  <p className="text-gray-600">{product.quantity} units</p>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.quantity > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Quantity</h4>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                    >
                      -
                    </button>
                    <span className="w-16 text-center py-2 border border-gray-300 rounded-lg">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity <= 0}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center transition-colors ${
                    product.quantity > 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center"
                >
                  <FaPhone className="mr-2" /> Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Contact Seller</h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleContactSeller("whatsapp")}
                className="flex items-center justify-center p-4 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                WhatsApp
              </button>
              <button
                onClick={() => handleContactSeller("telegram")}
                className="flex items-center justify-center p-4 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FaTelegram className="mr-2 text-xl" />
                Telegram
              </button>
              <button
                onClick={() => handleContactSeller("phone")}
                className="flex items-center justify-center p-4 border border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <FaPhone className="mr-2 text-xl" />
                Call
              </button>
              <button
                onClick={() => handleContactSeller("email")}
                className="flex items-center justify-center p-4 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FaEnvelope className="mr-2 text-xl" />
                Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Share Product</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center justify-center p-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FaFacebook className="mr-2 text-xl" />
                Facebook
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center justify-center p-4 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FaTwitter className="mr-2 text-xl" />
                Twitter
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="flex items-center justify-center p-4 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                WhatsApp
              </button>
              <button
                onClick={() => handleShare("telegram")}
                className="flex items-center justify-center p-4 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FaTelegram className="mr-2 text-xl" />
                Telegram
              </button>
              <button
                onClick={() => handleShare("copy")}
                className="col-span-2 flex items-center justify-center p-4 border border-gray-500 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaCopy className="mr-2 text-xl" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
