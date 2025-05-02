import React, { useEffect, useState } from 'react';
import { FaBars, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Sidebar } from '../components/Sidebar';
import { SellersTable } from '../components/SuperAdmin/SellersTable';
import { SuperAdminStats } from '../components/SuperAdmin/StatsCard';
import { StoresTable } from '../components/SuperAdmin/StoresTable';
import { UsersTable } from '../components/SuperAdmin/UsersTable';
import { supabase } from '../supabase-client';

function Dashboard() {
  const [active, setActive] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Product form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');

    // Super Admin states
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [stats, setStats] = useState({
      totalUsers: 0,
      totalStores: 0,
      totalSellers: 0
    });
    const [superAdminLoading, setSuperAdminLoading] = useState(false);
    const [superAdminError, setSuperAdminError] = useState(null);

  // Fetch super admin data
  useEffect(() => {
    const fetchSuperAdminData = async () => {
      try {
        setSuperAdminLoading(true);
        setSuperAdminError(null);

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*');

        if (usersError) throw usersError;

        // Fetch stores
        const { data: storesData, error: storesError } = await supabase
          .from('stores')
          .select('*');

        if (storesError) throw storesError;

        // Fetch sellers
        const { data: sellersData, error: sellersError } = await supabase
          .from('sellers')
          .select('*');

        if (sellersError) throw sellersError;

        // Fetch stats
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const { count: totalStores } = await supabase
          .from('stores')
          .select('*', { count: 'exact', head: true });

        const { count: totalSellers } = await supabase
          .from('sellers')
          .select('*', { count: 'exact', head: true });

        setUsers(usersData || []);
        setStores(storesData || []);
        setSellers(sellersData || []);
        setStats({ totalUsers, totalStores, totalSellers });

      } catch (err) {
        setSuperAdminError(err.message);
      } finally {
        setSuperAdminLoading(false);
      }
    }
    fetchSuperAdminData();
  }, []);
  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };
  // Handle store deletion
  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);
      if (error) throw error;
      setStores(prev => prev.filter(store => store.id !== storeId));
    } catch (err) {
      alert('Error deleting store: ' + err.message);
    }
  };

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Fetch user's products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setError('Authentication required');
          return;
        }

        // Get user's store ID
        const { data: seller, error: sellerError } = await supabase
          .from('sellers')
          .select('store_id')
          .eq('user_id', user.id)
          .single();

        if (sellerError || !seller) {
          setError('You need to create a store first');
          return;
        }

        // Get products for this store
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) throw new Error('Authentication required');
      if (!name || !description || !category || !price || !quantity || !image) {
        throw new Error('Please fill all required fields');
      }

      // Get user's store ID
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
          image,
          store_id: seller.store_id 
        }]);

      if (error) throw error;

      // Refresh products
      const { data: newProducts } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', seller.store_id);

      setProducts(newProducts || []);
      resetForm();

    } catch (err) {
      alert(err.message);
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
      alert('Error deleting product: ' + err.message);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setQuantity('');
    setImage('');
  };

  if (loading) {
    return <div className="p-4">Loading products...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

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

                  {/* Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
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
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Quantity</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
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
                        <td className="px-4 py-2">{product.quantity}</td>
                        <td className="px-4 py-2 flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => {
                              setName(product.name);
                              setDescription(product.description);
                              setCategory(product.category);
                              setPrice(product.price);
                              setQuantity(product.quantity);
                              setImage(product.image);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
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
           {active === "superAdmin" && (
            <div className="space-y-6">
              <SuperAdminStats stats={stats} />
              <UsersTable users={users} onDeleteUser={handleDeleteUser} />
              <StoresTable stores={stores} users={users} onDeleteStore={handleDeleteStore} />
              <SellersTable sellers={sellers} stores={stores} />
              
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;