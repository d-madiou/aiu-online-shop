"use client"

import { useState } from "react"
import {
    FaEnvelope,
    FaFacebook,
    FaInstagram,
    FaMapMarkerAlt,
    FaPhone,
    FaTiktok,
    FaTwitter,
    FaWhatsapp,
} from "react-icons/fa"
import { Link } from "react-router-dom"
import logoImage from "../assets/Images/logo.png"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribeSuccess, setSubscribeSuccess] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email || !email.includes("@")) return

    setIsSubscribing(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false)
      setSubscribeSuccess(true)
      setEmail("")

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubscribeSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="mb-6">
              <img src={logoImage || "/placeholder.svg"} alt="AIU E-SHOP" className="h-10 w-auto" />
            </div>
            <p className="mb-6 text-gray-400">
              For all your needs. Shop with us and experience the best online marketplace with quality products and
              excellent service.
            </p>
            <div className="space-y-2">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <p>123 AIU Campus, Jalan University, 47500 Subang Jaya, Selangor</p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-blue-500 mr-3 flex-shrink-0" />
                <p>+60 12 345 6789</p>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-blue-500 mr-3 flex-shrink-0" />
                <p>info@aiueshop.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-blue-500 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-blue-500 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-500 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-500 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-500 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop?category=electronics"
                  className="hover:text-blue-500 transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=clothing"
                  className="hover:text-blue-500 transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=food"
                  className="hover:text-blue-500 transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Food & Beverages
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=books"
                  className="hover:text-blue-500 transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Books
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=health"
                  className="hover:text-blue-500 transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Health & Beauty
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Newsletter</h3>
            <p className="mb-4 text-gray-400">Subscribe to receive updates on new arrivals and special offers</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="absolute right-0 top-0 h-full px-4 bg-blue-800 text-white rounded-r-lg hover:bg-blue-700 transition-colors duration-300 flex items-center"
                >
                  {isSubscribing ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
              {subscribeSuccess && (
                <p className="text-green-500 text-sm">Thank you for subscribing to our newsletter!</p>
              )}
            </form>

            {/* Social Media */}
            <h3 className="text-lg font-bold mt-8 mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black transition-colors duration-300"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} AIU E-SHOP. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-blue-500 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-blue-500 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-500 hover:text-blue-500 transition-colors duration-200">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
