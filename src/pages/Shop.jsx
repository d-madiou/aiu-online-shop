"use client"

import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { FaFilter, FaHome, FaSearch } from "react-icons/fa"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import ProductList from "../components/ProductList"

function Shop() {
  const products = useSelector((state) => state.product.products || [])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState(["All"])

  useEffect(() => {
    // Extract unique categories from products
    if (products && products.length > 0) {
      const uniqueCategories = ["All", ...new Set(products.map((product) => product.category).filter(Boolean))]
      setCategories(uniqueCategories)
      setLoading(false)
    }
  }, [products])

  // Filter products based on category and search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch =
      !searchTerm ||
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "var(--font)" }}>
      {/* SEO Optimization */}
      <Helmet>
        <title>Shop Products | AIU Marketplace</title>
        <meta
          name="description"
          content="Browse our wide selection of products at AIU Marketplace. Find electronics, clothing, food, and more at great prices."
        />
        <meta
          name="keywords"
          content="AIU marketplace, shop online, student marketplace, electronics, clothing, food"
        />
        <link rel="canonical" href="https://aiumarketplace.com/shop" />
      </Helmet>

      {/* Header Banner */}
      <div className="bg-blue-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Shop Our Products</h1>
            <p className="text-blue-100 max-w-2xl">Browse our collection of quality products at competitive prices</p>

            {/* Breadcrumbs */}
            <div className="flex items-center mt-4 text-sm">
              <Link to="/" className="text-blue-200 hover:text-white flex items-center">
                <FaHome className="mr-1" /> Home
              </Link>
              <span className="mx-2 text-blue-300">/</span>
              <span className="text-white">Shop</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <div className="relative">
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {loading ? "Loading products..." : `${filteredProducts.length} Products`}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </h2>
        </div>

        {/* Product List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try changing your search or filter criteria</p>
            <button
              onClick={() => {
                setSelectedCategory("All")
                setSearchTerm("")
              }}
              className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ProductList products={filteredProducts} viewMode="grid" />
        )}
      </div>
    </div>
  )
}

export default Shop
