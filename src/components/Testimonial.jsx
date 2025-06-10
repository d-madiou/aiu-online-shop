"use client"

import { useEffect, useRef, useState } from "react"
import { FaChevronLeft, FaChevronRight, FaQuoteLeft, FaStar, FaUser } from "react-icons/fa"
import { supabase } from "../supabase-client"

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([])
  const [newTestimonial, setNewTestimonial] = useState({
    title: "",
    description: "",
    rating: 5,
  })
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState(null)
  const sliderRef = useRef(null)

  // Fetch user and testimonials on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Fetch testimonials
      await fetchTestimonials()
    }

    fetchData()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select(`
          id,
          title,
          description,
          rating,
          created_at,
          user_id,
          profiles:user_id (email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Format data with email and fallback if empty
      const formattedData = data?.length > 0 
        ? data.map(item => ({
            ...item,
            email: item.profiles?.email || 'anonymous@example.com'
          }))
        : [
            {
              id: 1,
              title: "Great Experience",
              description: "The platform is easy to use and products are delivered quickly.",
              rating: 5,
              email: "user1@example.com",
              created_at: new Date().toISOString()
            },
            {
              id: 2,
              title: "Quality Products",
              description: "I'm impressed with the quality of items available here.",
              rating: 4,
              email: "user2@example.com",
              created_at: new Date().toISOString()
            }
          ]

      setTestimonials(formattedData)
    } catch (error) {
      console.error("Error fetching testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTestimonial(prev => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rating) => {
    setNewTestimonial(prev => ({ ...prev, rating }))
  }

  const addTestimonial = async (e) => {
    e.preventDefault()
    
    if (!user) {
      alert("Please sign in to submit a review")
      return
    }

    const { title, description, rating } = newTestimonial

    if (!title || !description) {
      alert("Title and description are required!")
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("testimonials")
        .insert([{ 
          title, 
          description, 
          rating,
          user_id: user.id 
        }])
        .select()

      if (error) throw error

      // Update local state with new testimonial
      const newItem = {
        ...data[0],
        email: user.email,
        profiles: { email: user.email }
      }
      
      setTestimonials(prev => [newItem, ...prev])
      setNewTestimonial({
        title: "",
        description: "",
        rating: 5,
      })
      setShowForm(false)
    } catch (error) {
      console.error("Error adding testimonial:", error)
      alert("Failed to add testimonial. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Slider navigation functions
  const nextSlide = () => {
    if (testimonials.length <= 1) return
    setCurrentIndex(prev => (prev + 1) % testimonials.length)
    scrollToTestimonial((currentIndex + 1) % testimonials.length)
  }

  const prevSlide = () => {
    if (testimonials.length <= 1) return
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)
    scrollToTestimonial((currentIndex - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    scrollToTestimonial(index)
  }

  const scrollToTestimonial = (index) => {
    if (sliderRef.current) {
      const testimonialWidth = sliderRef.current.offsetWidth
      sliderRef.current.scrollTo({
        left: index * testimonialWidth,
        behavior: "smooth"
      })
    }
  }

  // Get visible testimonials for desktop view
  const getVisibleTestimonials = () => {
    if (testimonials.length <= 3) return testimonials
    
    return [
      testimonials[currentIndex % testimonials.length],
      testimonials[(currentIndex + 1) % testimonials.length],
      testimonials[(currentIndex + 2) % testimonials.length]
    ]
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Read what our customers say about their shopping experience
        </p>
        <div className="h-1 w-24 bg-blue-800 mx-auto mt-4"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
        </div>
      ) : (
        <>
          {/* Desktop View - Grid */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {getVisibleTestimonials().map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start mb-4">
                    <div className="text-blue-800 mr-3 mt-1">
                      <FaQuoteLeft size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{testimonial.title}</h3>
                      <div className="flex mt-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                            size={14}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{testimonial.description}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-3">
                      <FaUser size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{testimonial.email}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            {testimonials.length > 3 && (
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Previous reviews"
                >
                  <FaChevronLeft className="text-gray-700" />
                </button>
                
                <div className="flex space-x-2">
                  {[...Array(Math.ceil(testimonials.length / 3))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i * 3)}
                      className={`w-2 h-2 rounded-full ${
                        currentIndex >= i * 3 && currentIndex < (i + 1) * 3 
                          ? "bg-blue-800" 
                          : "bg-gray-300"
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Next reviews"
                >
                  <FaChevronRight className="text-gray-700" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile View - Carousel */}
          <div className="md:hidden relative">
            <div
              ref={sliderRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6"
              style={{ scrollbarWidth: "none" }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-shrink-0 w-full snap-center px-2">
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <div className="flex items-start mb-4">
                      <div className="text-blue-800 mr-3 mt-1">
                        <FaQuoteLeft size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{testimonial.title}</h3>
                        <div className="flex mt-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                              size={14}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">{testimonial.description}</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-3">
                        {testimonial.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{testimonial.email}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(testimonial.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-2 h-2 rounded-full ${
                    currentIndex === i ? "bg-blue-800" : "bg-gray-300"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Review Form Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        {user ? (
          <>
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setShowForm(!showForm)}
                className={`px-6 py-3 rounded-md flex items-center ${
                  showForm
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-blue-800 text-white hover:bg-blue-700"
                } transition-colors`}
              >
                {showForm ? (
                  <>
                    <FaChevronLeft className="mr-2" />
                    Cancel
                  </>
                ) : (
                  "Write a Review"
                )}
              </button>
            </div>

            {showForm && (
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-bold mb-2">Share Your Experience</h3>
                <p className="text-gray-600 mb-6">Your review will help others make better decisions</p>
                
                <form onSubmit={addTestimonial}>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-3">Your Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none"
                        >
                          <FaStar
                            className={`text-2xl ${
                              star <= newTestimonial.rating 
                                ? "text-yellow-400" 
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                      Review Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newTestimonial.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Summarize your experience"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                      Detailed Review
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newTestimonial.description}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What did you like or dislike?"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              Want to share your experience?
            </h3>
            <p className="text-blue-700">
              Please sign in to leave a review and help others in our community
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Testimonial