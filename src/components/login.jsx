import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase-client';

const Login = ({ openSignUp, setIsModalOpen }) => {
    const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate('/'); 
      setIsModalOpen(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Login</h2>
      <form onSubmit={handleLogin}>
        <div className='mb-4'>
          <label htmlFor="email" className='block text-gray-700'>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            className='w-full px-3 py-2 border'
            placeholder='Enter Email'
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='password' className='block text-gray-700'>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            className='w-full px-3 py-2 border'
            placeholder='Enter password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className='w-full bg-red-600 text-white py-2'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      <div className='text-center'>
        <span className='text-gray-700'>Don't have an account?</span>
        <button className='text-red-800' onClick={openSignUp}>Sign up</button>
      </div>
    </div>
  );
}

export default Login;
