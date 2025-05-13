import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase-client';


const Register = ({openLogin}) =>{
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[fullName, setFullName] = useState('');
    const[message, setMessage] = useState('')

    const navigate = useNavigate()

    const handleRegister = async (event) => {
        event.preventDefault();
      
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName, 
            },
          },
        });
      
        if (error) {
          setMessage(error.message); // fixed: show the actual error message
        } else {
          setMessage('You are registered successfully');
          openLogin()
        }
      };
      


  return (
    <div>
        <h2 className='text-2xl font-bold mb-4'>Sign Up</h2>
        <form onSubmit={handleRegister}>
            <div className='mb-4'>
                <label htmlFor="fullName" className='block text-gray-700'>Full Name:</label>
                <input type="text" id="fullName" value={fullName}
                className='w-full px-3 py-2 border' placeholder='Enter your name'
                onChange={(e)=> setFullName(e.target.value)} />
            </div>
            <div className='mb-4'>
                <label htmlFor="email" className='block text-gray-700'>Email:</label>
                <input type="email" id="email"  value={email}
                className='w-full px-3 py-2 border' placeholder='Enter Email'
                onChange={(e)=> setEmail(e.target.value)} />
            </div>
            <div className='mb-4'>
                <label htmlFor='password' className='block text-gray-700'>Password:</label>
                <input type="password" id="password" value={password}
                className='w-full px-3 py-2 border' placeholder='Enter password'
                onChange={(e)=> setPassword(e.target.value)} />
            </div> 
            <div>
                <button type="submit" className='w-full bg-blue-600 text-white py-2'
                >Sign up</button>
            </div>
        </form>
        <div className='text-center'>
            <span className='text-gray-700'>Already have an account?</span>
            <button className='text-blue-800'
            onClick={openLogin}>Login</button>
        </div>
    </div>
  )
}

export default Register;
