"use client"

import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { FaArrowRight, FaShippingFast, FaTag, FaUndo, FaUserShield } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import CategorySection from "../components/CategorySection"
import DealCard from "../components/DealCard"
import Modal from "../components/Modal"
import ProductCard from "../components/ProductCard"
import Testimonial from "../components/Testimonial"
import { setProducts } from "../redux/productSlice"
import { supabase } from "../supabase-client"

const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const products = useSelector((state) => state.product.products || [])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=2070&auto=format&fit=crop",
      title: "Welcome to AIU Marketplace",
      subtitle: "Discover amazing products at unbeatable prices",
      cta: "Shop Now",
    },
    {
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2115&auto=format&fit=crop",
      title: "New Arrivals",
      subtitle: "Check out our latest collection",
      cta: "Explore",
    },
    {
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2115&auto=format&fit=crop",
      title: "Special Offers",
      subtitle: "Limited time deals you don't want to miss",
      cta: "View Deals",
    },
  ]

  useEffect(() => {
    const fetchProductsWithStores = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("products")
          .select(
            `
            *,
            stores!store_id (
                id,
                name,
                image_url,
                created_at
            )
            `,
          )
          .order("created_at", { ascending: false })

        if (error) throw error

        
        dispatch(setProducts(data || []))
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductsWithStores()

    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [dispatch, heroSlides.length])

  
  const featuredProducts = products.slice(0, 4)

  
  const bestSellingProducts = products.slice(0, 4)

 
  const dealProducts = products.slice(0, 2)

  return (
    <div className="bg-white">
      <style>{scrollbarHideStyles}</style>

      
      <Helmet>
        <title>AIU Marketplace - Shop Online for the Best Deals</title>
        <meta
          name="description"
          content="Discover amazing products at unbeatable prices at AIU Marketplace. Shop for electronics, clothing, food, and more with free shipping on orders over RM100."
        />
        <meta
          name="keywords"
          content="AIU marketplace, online shopping, student marketplace, electronics, clothing, food delivery"
        />
        <meta property="og:title" content="AIU Marketplace - Shop Online for the Best Deals" />
        <meta
          property="og:description"
          content="Discover amazing products at unbeatable prices at AIU Marketplace. Shop for electronics, clothing, food, and more with free shipping on orders over RM100."
        />
        <meta property="og:image" content={heroSlides[0].image} />
        <meta property="og:url" content="https://aiumarketplace.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://aiumarketplace.com" />
      </Helmet>

      <Modal />

      <section aria-label="Featured promotions" className="relative h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-lg">
                  <span className="inline-block bg-blue-800 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    AIU MARKETPLACE
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{slide.title}</h1>
                  <p className="text-lg text-white mb-8">{slide.subtitle}</p>
                  <button
                    onClick={() => navigate("/shop")}
                    className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-all duration-300 flex items-center group"
                  >
                    {slide.cta}
                    <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Navigation */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-white scale-125" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <div className="px-4 md:px-8 lg:px-16">
        
        <section aria-label="Our guarantees" className="container mx-auto py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-blue-800/10 text-blue-800 p-3 rounded-full mb-3">
                <FaShippingFast size={24} />
              </div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-gray-600 mt-1">On orders over RM100</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-blue-800/10 text-blue-800 p-3 rounded-full mb-3">
                <FaUndo size={24} />
              </div>
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-sm text-gray-600 mt-1">30-day return policy</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-blue-800/10 text-blue-800 p-3 rounded-full mb-3">
                <FaTag size={24} />
              </div>
              <h3 className="font-semibold">Best Prices</h3>
              <p className="text-sm text-gray-600 mt-1">Price match guarantee</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-blue-800/10 text-blue-800 p-3 rounded-full mb-3">
                <FaUserShield size={24} />
              </div>
              <h3 className="font-semibold">Secure Shopping</h3>
              <p className="text-sm text-gray-600 mt-1">Protected payments</p>
            </div>
          </div>
        </section>

        <CategorySection />

        <section aria-label="Featured products" className="container mx-auto py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/shop" className="text-blue-800 hover:text-blue-600 font-medium flex items-center group">
              View All
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">Error loading products. Please try again later.</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide pb-4">
              <div className="flex space-x-4 md:grid md:grid-cols-4 md:gap-6 md:space-x-0 min-w-max md:min-w-0">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="w-[280px] md:w-auto flex-shrink-0">
                    <ProductCard product={product} store={product.stores} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Deal Banner */}
        <section aria-label="Special offers" className="container mx-auto py-8">
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-3/5 p-8 md:p-12">
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  LIMITED TIME OFFER
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Special Discount This Week</h2>
                <p className="text-white/90 mb-6">Get up to 50% off on selected items. Don't miss out!</p>
                <button
                  onClick={() => navigate("/shop")}
                  className="bg-white text-blue-800 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-300"
                >
                  Shop the Sale
                </button>
              </div>
              <div className="md:w-2/5 p-8 flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold text-white mb-2">50%</div>
                  <div className="text-xl font-bold text-white mb-4">OFF</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white/20 p-2 rounded">
                      <span className="block text-xl font-bold text-white">00</span>
                      <span className="text-xs text-white/80">Days</span>
                    </div>
                    <div className="bg-white/20 p-2 rounded">
                      <span className="block text-xl font-bold text-white">12</span>
                      <span className="text-xs text-white/80">Hours</span>
                    </div>
                    <div className="bg-white/20 p-2 rounded">
                      <span className="block text-xl font-bold text-white">45</span>
                      <span className="text-xs text-white/80">Mins</span>
                    </div>
                    <div className="bg-white/20 p-2 rounded">
                      <span className="block text-xl font-bold text-white">30</span>
                      <span className="text-xs text-white/80">Secs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deal of the Day */}
        <section aria-label="Deal of the day" className="container mx-auto py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Deal of the Day</h2>
            <Link to="/deals" className="text-blue-800 hover:text-blue-600 font-medium flex items-center group">
              View All Deals
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">Error loading deals. Please try again later.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dealProducts.map((product) => (
                <DealCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Best Selling Products */}
        <section aria-label="Best selling products" className="container mx-auto py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Best Selling Products</h2>
            <Link to="/shop" className="text-blue-800 hover:text-blue-600 font-medium flex items-center group">
              View All
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">Error loading products. Please try again later.</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide pb-4">
              <div className="flex space-x-4 md:grid md:grid-cols-4 md:gap-6 md:space-x-0 min-w-max md:min-w-0">
                {bestSellingProducts.map((product) => (
                  <div key={product.id} className="w-[280px] md:w-auto flex-shrink-0">
                    <ProductCard product={product} store={product.stores} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section aria-label="Newsletter subscription" className="container mx-auto py-12">
          <div className="bg-gray-50 rounded-xl p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600 mb-6">
                Stay updated with our latest offers, new arrivals, and exclusive discounts.
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonial />
      </div>
    </div>
  )
}

export default Home
