<div className='bg-white flex items-start'>
            <div className='mx-auto container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {itemInfo.map((item, index)=>(
                    <div key={index} className='flex bg-blue-800 flex-col items-start text-center p-4 border rounded-lg shadow
                     cursor-pointer'>
                        <div className="flex justify-items-start items-center space-x-4">
                            <img src={item.imageURL} alt="" className='w-15 h-15 rounded-4xl border-3 border-white
                            transform transition-transform duration-300 hover:scale-115'/>
                            <h3 className='text-2xl text-white font-medium'>{item.name}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="container mx-auto py-4 flex flex-col md:flex-row">
                    <div className="w-full md:w-3/12">
                            <div className="bg-red-600 text-white text-xs font-bold px-2 py-2.5">Order by Catgories</div>
                            <ul className="space-y-4 bg-gray-100 p-3 border">
                                {Categories.map((category, index) => (
                                    <li key={index} className="flex items-center text-sm font-medium">
                                        <div className="w-2 h-2 border border-red-500 rounded-full mr-2"></div>
                                        {category}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full md:w-9/12 mt-0 h-96 relative">
                           <img src={HeroImage} alt="hero" className="h-full w-full object-cover" />
                            <div className="absolute top-16 left-8 ">
                                <p className="text-gray-600 mb-4">The best online market place</p>
                                <h2 className="text-3xl font-bold">WELCOME TO AIU MARKET PLACE</h2>
                                <p className="text-xl mt-2.5 font-bold text-gray-800">THOUSANDS+ PRODUCTS</p>
                                <button className="bg-blue-800 px-8 py-1.5 text-white mt-4 hover:bg-blue-500
                                transform transition-transform duration-300 hover:scale-105"
                                onClick={() => navigate('/shop')}>SHOP NOW</button>
                        </div>
                    </div>
                </div>
</div>

"use client"
import { useState } from "react"
import { FaBox, FaEdit, FaPlus, FaShoppingBag, FaTrash } from "react-icons/fa"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("products")
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      category: "Clothing",
      stock: 45,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      category: "Electronics",
      stock: 12,
      image: "/placeholder.svg?height=80&width=80",
    },
  ])

  const [orders, setOrders] = useState([
    {
      id: "ORD-2023-001",
      customer: "John Doe",
      date: "2023-11-15",
      total: 119.98,
      items: 2,
      status: "Pending",
    },
    {
      id: "ORD-2023-002",
      customer: "Jane Smith",
      date: "2023-11-14",
      total: 89.99,
      items: 1,
      status: "Pending",
    },
  ])

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct({
      ...newProduct,
      [name]: value,
    })
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    const productToAdd = {
      id: products.length + 1,
      ...newProduct,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock),
      image: "/placeholder.svg?height=80&width=80",
    }
    setProducts([...products, productToAdd])
    setNewProduct({
      name: "",
      price: "",
      category: "",
      stock: "",
    })
  }

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const handleOrderAction = (id, action) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: action === "accept" ? "Accepted" : "Declined" } : order,
      ),
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4 text-xl font-bold border-b border-blue-700">AIU Marketplace</div>
        <nav className="mt-6">
          <button
            className={`flex items-center w-full px-4 py-3 ${
              activeTab === "products" ? "bg-blue-700" : "hover:bg-blue-700"
            } transition-colors duration-200`}
            onClick={() => setActiveTab("products")}
          >
            <FaBox className="mr-3" />
            Products
          </button>
          <button
            className={`flex items-center w-full px-4 py-3 ${
              activeTab === "orders" ? "bg-blue-700" : "hover:bg-blue-700"
            } transition-colors duration-200`}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingBag className="mr-3" />
            Orders
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab === "products" ? "Product Management" : "Order Management"}
            </h1>
          </div>
        </header>

        <main className="p-6">
          {activeTab === "products" ? (
            <>
              {/* Add Product Form */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-medium mb-4">Add New Product</h2>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (RM)</label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={newProduct.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                      min="0"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      <FaPlus className="mr-2" /> Add Product
                    </button>
                  </div>
                </form>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium">Your Products</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">RM {product.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.stock}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            // Orders Table
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">RM {order.total.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Accepted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {order.status === "Pending" && (
                            <>
                              <button
                                className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 mr-2"
                                onClick={() => handleOrderAction(order.id, "accept")}
                              >
                                Accept
                              </button>
                              <button
                                className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                                onClick={() => handleOrderAction(order.id, "decline")}
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard



