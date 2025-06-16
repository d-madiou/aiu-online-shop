"use client"

import { Helmet } from "react-helmet"
import { FaCheckCircle, FaEnvelope, FaMapMarkerAlt, FaPhone, FaShieldAlt, FaShoppingBag, FaUsers } from "react-icons/fa"
import { Link } from "react-router-dom"
import Member1 from '../assets/team/member 1.jpg'
import Member2 from '../assets/team/member 2.jpg'
import Member3 from '../assets/team/member 3.jpg'
import Member4 from '../assets/team/member 4.jpg'


const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Akram Ebrahim Qaid Awadh",
      title: " Project Lead & Strategic Manager",
      image: Member2,
    },
    {
      name: "Abdullah Saleh Khamis Al-Hadri",
      title: " Head of Technical Development",
      image: Member1,
    },
    {
      name: "Sabrin Ereet Mohamed Ereet",
      title: " Marketing & Data Analytics Manager",
      image: Member4,
    },
    {
      name: "Abdalrawf Mohammed Mohammed Ali",
      title: "Community Relations & Outreach Coordinator",
      image: Member3,
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SEO */}
      <Helmet>
        <title>About AIU Business Hub</title>
        <meta name="description" content="Connecting AIU – Creating Opportunities" />
        <meta name="keywords" content="AIU Business Hub, about us, student aiu shop, campus shopping, AIU e-commerce" />
        <link rel="canonical" href="https://aiubusiness.com/about" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About AIU Business Hub</h1>
            <p className="text-xl text-blue-100">Connecting AIU – Creating Opportunities</p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              The AIU Business Hub is a student-led initiative founded by final-year Economics students at Albukhary
              International University (AIU). The platform was created to empower the AIU entrepreneurial community by
              offering a modern digital marketplace—a smarter alternative to traditional, unstructured e-marketing
              methods.
            </p>
            <p>
              Our goal is to help AIU student businesses grow, increase their visibility, and reach new customer
              segments, both within the university and beyond.
            </p>
            <p>
              But our vision goes further. We also welcome external businesses to access the AIU student market through
              this structured, campus-friendly digital platform. By 2030, we aspire to become one of the most
              distinguished university-based e-commerce platforms in Kedah and Malaysia, supporting youth innovation and
              sustainable economic development.
            </p>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-100"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold mb-2">Community First</h3>
              <p className="text-gray-700">
                We prioritize the needs of our AIU community, creating a platform that fosters connection and mutual
                support among students and faculty.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                <FaShieldAlt />
              </div>
              <h3 className="text-xl font-bold mb-2">Trust & Safety</h3>
              <p className="text-gray-700">
                We're committed to creating a secure environment where users can trade with confidence, knowing their
                transactions and personal information are protected.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                <FaShoppingBag />
              </div>
              <h3 className="text-xl font-bold mb-2">Accessibility</h3>
              <p className="text-gray-700">
                We believe everyone in our community should have access to affordable goods and services, with a
                platform that's easy to use for both buyers and sellers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
          <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="text-blue-600 mr-4 mt-1">
                <FaCheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Student-to-Student Commerce</h3>
                <p className="text-gray-700">
                  Buy and sell textbooks, electronics, furniture, and more directly with fellow students, cutting out
                  the middleman and saving money.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-blue-600 mr-4 mt-1">
                <FaCheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Campus Food Delivery</h3>
                <p className="text-gray-700">
                  Order from campus cafeterias, student-run food businesses, and local restaurants with convenient
                  delivery to your dorm or campus location.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-blue-600 mr-4 mt-1">
                <FaCheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Student Services</h3>
                <p className="text-gray-700">
                  Find tutoring, design work, tech support, and other services offered by talented AIU students and
                  faculty.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-blue-600 mr-4 mt-1">
                <FaCheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Campus Store</h3>
                <p className="text-gray-700">
                  Shop for AIU merchandise, event tickets, and campus essentials through our official university store
                  section.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Our Community */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Whether you're looking to buy, sell, or simply connect with fellow AIU members, we welcome you to be part of
            our growing marketplace community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/shop"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              to="/"
              className="bg-blue-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-blue-600 text-3xl mb-4 flex justify-center">
              <FaMapMarkerAlt />
            </div>
            <h3 className="text-lg font-bold mb-2">Visit Us</h3>
            <p className="text-gray-700">
              Campus of Albukhary International University (AIU)
              <br />
              Jalan Tun Razak,
              <br />
              05200 Alor Setar
              <br />, Kedah, Malaysia
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-blue-600 text-3xl mb-4 flex justify-center">
              <FaEnvelope />
            </div>
            <h3 className="text-lg font-bold mb-2">Email Us</h3>
            <p className="text-gray-700">
              General Inquiries:
              <br />
              <a href="mailto:info@aiumarketplace.com" className="text-blue-600 hover:underline">
                info@aiubusinesshub.com
              </a>
              <br />
              <br />
              Support:
              <br />
              <a href="mailto:support@aiumarketplace.com" className="text-blue-600 hover:underline">
                support@aiubusinesshub.com
              </a>
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-blue-600 text-3xl mb-4 flex justify-center">
              <FaPhone />
            </div>
            <h3 className="text-lg font-bold mb-2">Call Us</h3>
            <p className="text-gray-700">
              Customer Service:
              <br />
              <a href="tel:+60123456789" className="text-blue-600 hover:underline">
                +60 11-3797 0106
              </a>
              <br />
              <br />
              Technical Support:
              <br />
              <a href="tel:+60123456780" className="text-blue-600 hover:underline">
                +60 19-484 0468
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Who can use AIU Marketplace?</h3>
              <p className="text-gray-700">
                AIU Marketplace is open to all current students, faculty, and staff of AIU. You'll need a valid AIU
                email address to register.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">How do I start selling on AIU Marketplace?</h3>
              <p className="text-gray-700">
                Simply create an account, click on "Create Store" in the navigation menu, and follow the steps to set up
                your store. Once approved, you can start listing your products or services.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Is there a fee for using AIU Marketplace?</h3>
              <p className="text-gray-700">
                Basic accounts are free. We charge a small service fee (5%) only when you make a sale, which helps us
                maintain the platform and provide secure payment processing.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">How are payments handled?</h3>
              <p className="text-gray-700">
                We offer multiple payment options including cash on delivery, Touch 'n Go, and QR code payments. All
                online payments are securely processed through our platform to protect both buyers and sellers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
