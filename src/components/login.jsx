import React from 'react';

const Login = ({openSignUp}) => {
  return (
    <div>
        <h2 className='text-2xl font-bold mb-4'>Login</h2>
        <form>
            <div className='mb-4'>
                <label htmlFor="username" className='block text-gray-700'>Email:</label>
                <input type="email" id="username" name="username" 
                className='w-full px-3 py-2 border' placeholder='Enter Email' />
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700'>Password:</label>
                <input type="password" id="username" name="username" 
                className='w-full px-3 py-2 border' placeholder='Enter password' />
            </div>
            <div className='mb-4 flex items-center justify-between'>
                <label className='inline-flex items-center'>
                    <input type="checkbox" id="remember" name="remember" />
                    <span className='ml-2 text-gray-700'>Remember me</span>
                </label>
                <a href=""  className='text-red-800'>Forgot Password?</a>
            </div>
            <div>
                <button type="submit" className='w-full bg-red-600 text-white py-2'
                >Login</button>
            </div>
        </form>
        <div className='text-center'>
            <span className='text-gray-700'>Don't have an account?</span>
            <button className='text-red-800'
            onClick={openSignUp}>Sign up</button>
        </div>
    </div>
  )
}

export default Login;
