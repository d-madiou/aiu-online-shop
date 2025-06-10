import React, { useEffect, useState } from 'react';
import { FaBars, FaEdit, FaPlus, FaTrash, FaTruck } from 'react-icons/fa';
import { Sidebar } from '../components/Sidebar';
import { supabase } from '../supabase-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [active, setActive] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError(null);
        if (!user) return;

        const { data: seller, error: sellerError } = await supabase
          .from('sellers')
          .select('store_id')
          .eq('user_id', user.id)
          .single();

        if (sellerError || !seller) {
          setOrdersError('You need to create a store first');
          return;
        }

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`*, order_items:order_items(*, product:product_id(*)), shipping_info:shipping_info_id(*)`);

        if (ordersError) throw ordersError;

        const filteredOrders = (ordersData || []).filter(order =>
          order.order_items.some(item => item.product?.store_id === seller.store_id)
        );

        setOrders(filteredOrders);
      } catch (err) {
        setOrdersError(err.message);
      } finally {
        setOrdersLoading(false);
      }
    };
    if (user && active === 'orders') fetchOrders();
  }, [user, active]);

  const handleOrderAction = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (err) {
      toast.error('Error updating order status: ' + err.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!user) return;

        const { data: seller, error: sellerError } = await supabase
          .from('sellers')
          .select('store_id')
          .eq('user_id', user.id)
          .single();

        if (sellerError || !seller) {
          setError('You need to create a store first');
          return;
        }

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', seller.store_id);

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProducts();
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('store-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('store-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) throw new Error('Authentication required');
      if (!name || !description || !category || !price || !quantity || !shippingCost || !imageFile) {
        throw new Error('Please fill all required fields');
      }

      const imageUrl = await uploadImage();

      const { data: seller } = await supabase
        .from('sellers')
        .select('store_id')
        .eq('user_id', user.id)
        .single();

      if (!seller) throw new Error('Store not found');

      const { error } = await supabase
        .from('products')
        .insert([{ 
          name, 
          description, 
          category, 
          price: parseFloat(price), 
          quantity: parseInt(quantity), 
          shipping_cost: parseFloat(shippingCost),
          image: imageUrl, 
          store_id: seller.store_id 
        }]);

      if (error) throw error;

      const { data: newProducts } = await supabase.from('products').select('*').eq('store_id', seller.store_id);
      setProducts(newProducts || []);
      toast.success('Product added successfully!', {
        position: "top-center",
        autoClose: 2000,
      });
      resetForm();
    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
        autoClose: 2000,
      });
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { data: seller } = await supabase
        .from('sellers')
        .select('store_id')
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('store_id', seller.store_id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      toast.error('Error deleting product: ' + err.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setQuantity('');
    setShippingCost('');
    setImageFile(null);
    setImagePreview('');
  };

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'on_the_way': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 ml-0 md:ml-6">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            {active === "products" ? "Manage Products" : "Manage Orders"}
          </h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="md:hidden text-blue-800 text-xl"
          >
            <FaBars />
          </button>
        </header>

        <main className="p-4">
          {active === "products" && (
            <>
              <div className="bg-white p-4 shadow-sm rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Foods">Foods</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Clothes">Clothes</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (RM)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  {/* Shipping Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost (RM)</label>
                    <input
                      type="number"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover mb-2 rounded" />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                          </div>
                        )}
                        <input 
                          id="dropzone-file" 
                          type="file" 
                          className="hidden" 
                          onChange={handleImageChange}
                          accept="image/*"
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-700 text-white py-2 px-4 rounded-md flex items-center hover:bg-blue-800 transition"
                    >
                      <FaPlus className="mr-2" /> Add Product
                    </button>
                  </div>
                </form>
              </div>

              {/* Product List */}
              <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Product</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Category</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Price</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Shipping Cost</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Quantity</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                          No products found. Start by adding your first product.
                        </td>
                      </tr>
                    ) : products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-2 flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover mr-4 rounded"
                          />
                          {product.name}
                        </td>
                        <td className="px-4 py-2">{product.category}</td>
                        <td className="px-4 py-2">RM {product.price}</td>
                        <td className="px-4 py-2">RM {product.shipping_cost || '0.00'}</td>
                        <td className="px-4 py-2">{product.quantity}</td>
                        <td className="px-4 py-2 flex space-x-2">
                          <button
                            className="text-blue-600 mb-6 hover:text-blue-800"
                            onClick={() => {
                              setName(product.name);
                              setDescription(product.description);
                              setCategory(product.category);
                              setPrice(product.price);
                              setQuantity(product.quantity);
                              setShippingCost(product.shipping_cost || '');
                              setImagePreview(product.image);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-600 mb-6 hover:text-red-800"
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
            </>
          )}
          
          {active === "orders" ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Recent Orders</h2>
              </div>
              {ordersLoading ? (
                <div className="p-4">Loading orders...</div>
              ) : ordersError ? (
                <div className="p-4 text-red-500">{ordersError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    {/* Table headers remain the same */}
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-4 md:px-6 py-6 text-center text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                #{order.id.slice(0, 8)}
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {order.shipping_info?.first_name} {order.shipping_info?.last_name}
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(order.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                RM {order.total_price.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {order.shipping_info?.address}
                                {order.shipping_info?.exact_place && `, ${order.shipping_info.exact_place}`}
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${getStatusClass(order.status)}`}>
                                {order.status === 'on_the_way' && <FaTruck className="mr-1" />}
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {order.status === 'pending' && (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 text-xs md:text-sm"
                                    onClick={() => handleOrderAction(order.id, 'accepted')}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 text-xs md:text-sm"
                                    onClick={() => handleOrderAction(order.id, 'declined')}
                                  >
                                    Decline
                                  </button>
                                </div>
                              )}
                              {order.status === 'accepted' && (
                                <button
                                  className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 text-xs md:text-sm"
                                  onClick={() => handleOrderAction(order.id, 'on_the_way')}
                                >
                                  Mark On The Way
                                </button>
                              )}
                              {order.status === 'on_the_way' && (
                                <button
                                  className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 text-xs md:text-sm"
                                  onClick={() => handleOrderAction(order.id, 'delivered')}
                                >
                                  Mark Delivered
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-gray-500">
              <p>Select "Manage Products" to add or edit your products.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;