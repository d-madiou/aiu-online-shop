"use client"

import { Helmet } from "react-helmet"
import { FaArrowLeft, FaShieldAlt, FaUserShield, FaLock, FaEnvelope } from "react-icons/fa"
import { Link } from "react-router-dom"

const Privacy = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SEO */}
      <Helmet>
        <title>Privacy Policy | AIU Business Hub</title>
        <meta
          name="description"
          content="Learn how AIU Business Hub collects, uses, and protects your personal information. Read our comprehensive privacy policy."
        />
        <meta name="keywords" content="privacy policy, data protection, AIU Business Hub, user privacy" />
        <link rel="canonical" href="https://aiubusiness.com/privacy" />
      </Helmet>

      {/* Header */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/about" className="flex items-center text-blue-200 hover:text-white transition-colors mr-4">
              <FaArrowLeft className="mr-2" /> Back to About
            </Link>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <FaShieldAlt className="text-5xl text-blue-200" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-blue-100">
              At AIU Business Hub, your privacy is important to us. Learn how we protect your information.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-8">
                This Privacy Policy outlines how we collect, use, store, and protect your information when you use our
                platform.
              </p>

              {/* Section 1 */}
              <div className="mb-10">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaUserShield className="text-blue-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">1. Information We Collect</h2>
                </div>
                <p className="text-gray-700 mb-4">We collect the following types of information:</p>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Personal Information:</h3>
                    <p className="text-gray-700">
                      Name, email, contact number, and (optional) AIU ID for internal users.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Business Listings:</h3>
                    <p className="text-gray-700">
                      Product/service details, pricing, descriptions, and photos for products/services.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Usage Data:</h3>
                    <p className="text-gray-700">Page visits, activity logs, and search history.</p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-10">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <FaShieldAlt className="text-green-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">2. How We Use Your Information</h2>
                </div>
                <p className="text-gray-700 mb-4">We use your data to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Facilitate buying and selling between users</li>
                  <li>Improve the functionality and user experience of the platform</li>
                  <li>Contact you for updates, promotions, or support</li>
                  <li>Enforce our terms and policies</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="mb-10">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <FaUserShield className="text-purple-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">3. Data Sharing</h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-2">Internal Users (AIU):</h3>
                    <p className="text-gray-700">
                      Your business listings and contact info will be visible to internal and other external users.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h3 className="font-semibold text-gray-800 mb-2">External Users:</h3>
                    <p className="text-gray-700">
                      Your business listings and contact info will be visible to internal and other external users.
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <p className="text-gray-700 font-medium">
                      We do not sell or rent your personal data to any third party.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-10">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-lg mr-3">
                    <FaLock className="text-red-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">4. Security</h2>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700">
                    We employ appropriate technical and organizational measures to safeguard your data. However, no
                    system is 100% secure.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div className="mb-10">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                    <FaUserShield className="text-yellow-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">5. Your Rights</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">You may request access to or correction of your personal data</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      You may request deletion of your account or business listing at any time
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaEnvelope className="text-blue-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">6. Contact</h2>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <p className="text-gray-700 mb-2">For privacy-related concerns, email:</p>
                  <a
                    href="mailto:support@aiubusinesshub.com"
                    className="text-blue-600 hover:text-blue-800 font-medium text-lg"
                  >
                    support@aiubusinesshub.com
                  </a>
                </div>
              </div>

              {/* Last Updated */}
              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500">
                  Last updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/about"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <FaArrowLeft className="text-blue-600 text-2xl mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Back to About</h3>
              <p className="text-gray-600 text-sm">Learn more about our company</p>
            </Link>
            <a
              href="mailto:support@aiubusinesshub.com"
              className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              <FaEnvelope className="text-white text-2xl mx-auto mb-2" />
              <h3 className="font-semibold">Contact Support</h3>
              <p className="text-blue-100 text-sm">Have privacy questions?</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
