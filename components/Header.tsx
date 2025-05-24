
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-center md:justify-start">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-10 h-10 mr-3 text-amber-500"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          <path d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM12 21.75a9.716 9.716 0 005.533-1.624 .75.75 0 01.788-1.285 11.216 11.216 0 010-13.682.75.75 0 01-.788-1.285A9.716 9.716 0 0012 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75z" opacity="0.5"/>
        </svg>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Trình Đánh Giá Code Gemini
        </h1>
      </div>
    </header>
  );
};
