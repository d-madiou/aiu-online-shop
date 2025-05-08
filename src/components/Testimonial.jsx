"use client"

import { useEffect, useRef, useState } from "react"
import { FaChevronLeft, FaChevronRight, FaQuoteLeft, FaStar, FaUser } from "react-icons/fa"
import ThiernoImage from "../assets/Images/ThiernoImage.png"
import { supabase } from "../supabase-client"

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([])
  const [newTestimonial, setNewTestimonial] = useState({
    title: "",
    description: "",
    name: "",
    rating: 5,
    image: ThiernoImage,
  })
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const sliderRef = useRef(null)

  // Fetch data on component mount
  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("testimo").select("*")

      if (error) {
        console.error("Error fetching testimonials:", error)
      } else {
        // If no testimonials, add some sample ones
        if (!data || data.length === 0) {
          setTestimonials([
            {
              id: 1,
              title: "Excellent Service",
              description:
                "I've been shopping here for months and the service is always top-notch. The products arrive quickly and in perfect condition.",
              name: "Sarah Johnson",
              rating: 5,
              image: ThiernoImage,
            },
            {
              id: 2,
              title: "Great Products",
              description:
                "The quality of products on this marketplace is exceptional. I've recommended it to all my friends at AIU.",
              name: "Michael Chen",
              rating: 4,
              image: ThiernoImage,
            },
            {
              id: 3,
              title: "Fast Delivery",
              description:
                "I ordered some snacks for a study session and they arrived within an hour! Incredible service for students.",
              name: "Aisha Rahman",
              rating: 5,
              image: ThiernoImage,
            },
          ])
        } else {
          setTestimonials(data)
        }
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTestimonial((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRatingChange = (rating) => {
    setNewTestimonial((prev) => ({
      ...prev,
      rating,
    }))
  }

  const addTestimonial = async (e) => {
    e.preventDefault()
    const { title, description, name, rating, image } = newTestimonial

    if (!title || !description || !name) {
      alert("Title, description, and name are required!")
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase.from("testimo").insert([
        { title, description, name, rating, image }, // Ensure your table has these columns
      ])

      if (error) {
        console.error("Error adding testimonial:", error)
        alert("Failed to add testimonial. Please try again.")
      } else {
        // If successful, add to local state and reset form
        const newItem = data?.[0] || {
          id: Date.now(),
          title,
          description,
          name,
          rating,
          image,
        }
        setTestimonials((prev) => [...prev, newItem])
        setNewTestimonial({
          title: "",
          description: "",
          name: "",
          rating: 5,
          image: ThiernoImage,
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const nextSlide = () => {
    if (testimonials.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    scrollToTestimonial((currentIndex + 1) % testimonials.length)
  }

  const prevSlide = () => {
    if (testimonials.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    scrollToTestimonial((currentIndex - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    scrollToTestimonial(index)
  }

  const scrollToTestimonial = (index) => {
    if (sliderRef.current) {
      const testimonialWidth = sliderRef.current.offsetWidth
      const scrollPosition = index * testimonialWidth
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  // For desktop view, show 3 testimonials at once if available
  const getVisibleTestimonials = () => {
    if (testimonials.length <= 3) return testimonials
    
    const result = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length
      result.push(testimonials[index])
    }
    return result
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
        <div className="h-1 w-24 bg-blue-800 mx-auto"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
        </div>
      ) : (
        <>
          {/* Desktop View - Grid of 3 testimonials */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {getVisibleTestimonials().map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col h-full"
                >
                  <div className="mb-4 text-blue-800">
                    <FaQuoteLeft size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{testimonial.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{testimonial.description}</p>
                  <div className="flex items-center mt-auto">
                    <div className="flex-shrink-0 mr-4">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                          <FaUser size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{testimonial.name}</p>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < (testimonial.rating || 5) ? "text-yellow-400" : "text-gray-300"}
                            size={14}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            {testimonials.length > 3 && (
              <div className="flex justify-center space-x-2 mt-6">
                {[...Array(Math.ceil(testimonials.length / 3))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i * 3)}
                    className={`w-3 h-3 rounded-full ${
                      Math.floor(currentIndex / 3) === i ? "bg-blue-800" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Navigation Arrows */}
            {testimonials.length > 3 && (
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={prevSlide}
                  className="bg-blue-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-blue-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Next testimonial"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>

          {/* Mobile View - Horizontal Scrolling */}
          <div className="md:hidden relative">
            <div
              ref={sliderRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-full snap-center px-4"
                >
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col h-full">
                    <div className="mb-4 text-blue-800">
                      <FaQuoteLeft size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{testimonial.title}</h3>
                    <p className="text-gray-600 mb-4">{testimonial.description}</p>
                    <div className="flex items-center mt-auto">
                      <div className="flex-shrink-0 mr-4">
                        {testimonial.image ? (
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                            <FaUser size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{testimonial.name}</p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < (testimonial.rating || 5) ? "text-yellow-400" : "text-gray-300"}
                              size={14}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full ${currentIndex === i ? "bg-blue-800" : "bg-gray-300"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Add Testimonial Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-800 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          {showForm ? "Cancel" : "Share Your Experience"}
        </button>
      </div>

      {/* Add Testimonial Form */}
      {showForm && (
        <div className="mt-8 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Share Your Experience</h3>
          <form onSubmit={addTestimonial}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Your Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTestimonial.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTestimonial.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a title for your review"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Your Review*
              </label>
              <textarea
                id="description"
                name="description"
                value={newTestimonial.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your experience with our marketplace"
                required
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Rating</label>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleRatingChange(i + 1)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      className={i < newTestimonial.rating ? "text-yellow-400" : "text-gray-300"}
                      size={24}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Testimonial
