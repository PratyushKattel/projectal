// import React from 'react';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">Login</h2>
        <p className="text-gray-500 mb-10">Welcome back! Please enter your details.</p>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email:</label>
            <input 
              type="email" 
              placeholder="harryjohnson@gmail.com" 
              className="w-full px-4 py-4 rounded-xl bg-[#E8F0FE] border-none outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-700">Password:</label>
              <button type="button" className="text-xs text-[#2557D6] font-semibold hover:underline">Forgot password?</button>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-4 rounded-xl bg-[#E8F0FE] border-none outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>

          <button type="submit" className="w-full bg-[#2557D6] hover:bg-[#1e46af] text-white font-bold py-4 rounded-xl transition shadow-lg">
            Sign in
          </button>
        </form>

        <div className="flex items-center my-10">
          <div className="flex-1 h-1px bg-gray-200"></div>
          <span className="px-4 text-xs text-gray-400 uppercase tracking-widest font-medium">or continue with</span>
          <div className="flex-1 h-1px bg-gray-200"></div>
        </div>

        <button type="button" className="w-full border border-gray-200 py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition font-semibold text-gray-700">
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="google" />
          <span className="text-[#2557D6]">Sign in with Google</span>
        </button>

        <p className="mt-10 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-[#2557D6] font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;