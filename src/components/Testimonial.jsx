import React, { useEffect, useState } from 'react'
import ThiernoImage from '../assets/Images/ThiernoImage.png'
import { supabase } from '../supabase-client'

const Testimonial = () => {
  const [testimo, setTestimo] = useState([])
  const [newTestimo, setNewTestimo] = useState({ title: '', description: '', name: 'thierno', image: ThiernoImage })
  const [loading, setLoading] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('testimo').select('*')

    if (error) {
      console.error('Error fetching testimonials:', error)
    } else {
      setTestimo(data)
    }
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTestimo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addTestimonial = async (e) => {
    e.preventDefault()
    const { title, description, name, image } = newTestimo

    if (!title || !description) {
      alert('Title and Description are required!')
      return
    }

    const { data, error } = await supabase.from('testimo').insert([
      { title, description, name, image } // Ensure your table has these columns
    ])

    if (error) {
      console.error('Error adding testimonial:', error)
    } else {
      setTestimo((prev) => [...prev, ...data])
      setNewTestimo({ title: '', description: '', name: 'Anonymous', image: ThiernoImage })
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">What Our Clients Say</h2>
      <div className="border-b-2 border-blue-500 w-24 mb-8"></div>

      {/* Form to add a new testimonial */}
      <form onSubmit={addTestimonial} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700">Title:</label>
          <input
            type="text"
            name="title"
            value={newTestimo.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter testimonial title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <textarea
            name="description"
            value={newTestimo.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter testimonial description"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Testimonial
        </button>
      </form>

      {/* Testimonials Section */}
      <div className="container mx-auto overflow-x-auto scrollbar-hide">
        {loading ? (
          <p>Loading testimonials...</p>
        ) : (
          <div className="flex space-x-4 whitespace-nowrap">
            {testimo && testimo.length > 0 ? (
              testimo.map((item) => (
                <div key={item.id} className="flex-none w-full sm:w-1/3 bg-white p-6 rounded-lg border shadow-md">
                  <p className="text-xl font-semibold text-gray-800 mb-4">{item.title}</p>
                  <p className="text-gray-600 mb-6">{item.description}</p>
                  <div className="flex items-center">
                    <img
                      src={item.image || ThiernoImage} // fallback if no image provided
                      alt={item.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="text-sm">
                      <p className="text-gray-900 leading-none font-extrabold">{item.name}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 w-full">No testimonials available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Testimonial
