import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F4FD] flex flex-col font-['Poppins',sans-serif] text-[#2D2442] selection:bg-[#B9A6E8]/30 selection:text-[#5B3FA0]">
      <Navbar />

      <main className="flex-1 pb-20 lg:pb-12">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};
