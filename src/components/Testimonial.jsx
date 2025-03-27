import React from 'react'
import ThiernoImage from '../assets/Images/ThiernoImage.png'

const Testimonial = ()=>{
    const testimo = [
        {
            id: 1,
            name: 'Thierno',
            title: "They have good quality of product and the price is affordable",
            description: "Représenter mon pays lors d'une Coupe du monde serait un rêve devenu réalité. Ce serait un honneur de porter les couleurs de mon pays que j'aime tant, et si l'opportunité se présente je donnerais tout pour aider l'équipe à atteindre cet objectif historique.",
            image: ThiernoImage,
        },
        {
            id: 2,
            name: 'Thierno',
            title: "They have good quality of product and the price is affordable",
            description: "Représenter mon pays lors d'une Coupe du monde serait un rêve devenu réalité. Ce serait un honneur de porter les couleurs de mon pays que j'aime tant, et si l'opportunité se présente je donnerais tout pour aider l'équipe à atteindre cet objectif historique.",
            image: ThiernoImage,
        },
        {
            id: 3,
            name: 'Thierno',
            title: "They have good quality of product and the price is affordable",
            description: "Représenter mon pays lors d'une Coupe du monde serait un rêve devenu réalité. Ce serait un honneur de porter les couleurs de mon pays que j'aime tant, et si l'opportunité se présente je donnerais tout pour aider l'équipe à atteindre cet objectif historique.",
            image: ThiernoImage,
        }
    ]

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    {/* Heading */}
    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">What Our Clients Say</h2>
    <div className="border-b-2 border-blue-500 w-24 mb-8"></div>
  
    {/* Testimonials Section */}
    <div className="container mx-auto overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 whitespace-nowrap">
        {testimo && testimo.length > 0 ? (
          testimo.map((item, index) => (
            <div key={index} className="flex-none w-full sm:w-1/3 bg-white p-6 rounded-lg border shadow-md">
              <p className="text-xl font-semibold text-gray-800 mb-4 text-wrap">{item.title}</p>
              <p className="text-gray-600 mb-6 text-wrap">{item.description}</p>
              <div className="flex items-center">
                <img
                  src={item.image}
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
    </div>
  </div>
  
  )
}

export default Testimonial
