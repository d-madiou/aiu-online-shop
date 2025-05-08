import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Sidebar } from '../components/Sidebar';
import { SellersTable } from '../components/SuperAdmin/SellersTable';
import { SuperAdminStats } from '../components/SuperAdmin/StatsCard';
import { StoresTable } from '../components/SuperAdmin/StoresTable';
import { UsersTable } from '../components/SuperAdmin/UsersTable';
import { supabase } from '../supabase-client';

function SuperAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalStores: 0, 
    totalSellers: 0 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('superadmin_auth');
      setIsAuthenticated(auth === 'authenticated');
    };
    return () => {
      sessionStorage.removeItem('superadmin_auth');
      setIsAuthenticated(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@aiubusinesshub.com' && password === 'businesshub2025') {
      localStorage.setItem('superadmin_auth', 'authenticated');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials');
    }
  };


  useEffect(() => {
    const fetchSuperAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          { data: usersData },
          { data: storesData },
          { data: sellersData },
          { count: totalUsers },
          { count: totalStores },
          { count: totalSellers }
        ] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('stores').select('*'),
          supabase.from('sellers').select('*'),
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('stores').select('*', { count: 'exact', head: true }),
          supabase.from('sellers').select('*', { count: 'exact', head: true })
        ]);

        setUsers(usersData || []);
        setStores(storesData || []);
        setSellers(sellersData || []);
        setStats({ totalUsers, totalStores, totalSellers });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSuperAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw error;
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    try {
      const { error } = await supabase.from('stores').delete().eq('id', storeId);
      if (error) throw error;
      setStores(prev => prev.filter(store => store.id !== storeId));
    } catch (err) {
      alert('Error deleting store: ' + err.message);
    }
  };

  const handleDeleteSeller = async (sellerId) => {
    if (!window.confirm('Are you sure you want to delete this seller and all associated data?')) return;
    
    try {
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('store_id')
        .eq('id', sellerId)
        .single();

      if (sellerError) throw sellerError;
      const storeId = sellerData.store_id;

      // Delete related products
      const { error: productsError } = await supabase
        .from('products')
        .delete()
        .eq('store_id', storeId);

      if (productsError) throw productsError;

      // Delete seller
      const { error: deleteSellerError } = await supabase
        .from('sellers')
        .delete()
        .eq('id', sellerId);

      if (deleteSellerError) throw deleteSellerError;

      // Delete store
      const { error: storeError } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (storeError) throw storeError;

      // Update state
      setSellers(prev => prev.filter(seller => seller.id !== sellerId));
      setStores(prev => prev.filter(store => store.id !== storeId));
    } catch (err) {
      console.error('Error deleting seller:', err);
      alert('Error deleting seller: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">SuperAdmin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar
        active="superAdmin"
        setActive={() => {}}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 ml-0 md:ml-6">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="md:hidden text-blue-800 text-xl"
          >
            <FaBars />
          </button>
        </header>

        <main className="p-4 space-y-6">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : error ? (
            <div className="p-4 text-red-500">Error: {error}</div>
          ) : (
            <>
              <SuperAdminStats stats={stats} />
              <UsersTable users={users} onDeleteUser={handleDeleteUser} />
              <StoresTable stores={stores} users={users} onDeleteStore={handleDeleteStore} />
              <SellersTable sellers={sellers} stores={stores} onDeleteSeller={handleDeleteSeller} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default SuperAdmin;