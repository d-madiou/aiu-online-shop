import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.error('Please check your email to activate your account. ' + error.message, {
        position: "top-center",
        autoClose: 5000,
      });
    } else {
      toast.success('Login successful!', {
        position: "top-center",
        autoClose: 5000,
      });

      setIsModalOpen(false); 
      navigate('/');
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
          <button type="submit" className='w-full bg-blue-700 text-white py-2'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      <div className='text-center'>
        <span className='text-gray-700'>Don't have an account?</span>
        <button className='text-blue-800' onClick={openSignUp}>Sign up</button>
      </div>
    </div>
  );
};

export default Login;
