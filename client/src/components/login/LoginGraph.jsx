// import React from 'react';
import { Link } from 'react-router-dom';

const LoginGraph = () => {
  return (
    <div className="hidden lg:flex w-1/2 bg-[#2557D6] flex-col items-center justify-between p-12 text-white">
      {/* Brand Logo */}
      <div className="self-start">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-white text-[#2557D6] w-10 h-10 flex items-center justify-center rounded-lg font-bold text-2xl shadow-lg">P</div>
          <h1 className="text-3xl font-bold tracking-tight">Projectal</h1>
        </Link>
      </div>

      {/* Center Collage Graphic */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 aspect-video flex flex-col items-center justify-center shadow-2xl">
         <div className="bg-white px-8 py-5 shadow-2xl transform -rotate-1">
            <h2 className="text-4xl font-black text-gray-900 tracking-widest">PROJECT</h2>
         </div>
      </div>

      <p className="text-xl font-medium opacity-90 text-center">Manage your project with ease.</p>
    </div>
  );
};

export default LoginGraph;