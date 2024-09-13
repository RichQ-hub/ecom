import React from 'react';
import Navbar from '../../components/Navbar';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <div className="bg-ecom-body-bg pt-12 min-h-screen">
        <Outlet />
      </div>
    </>
  );
};

export default RootLayout;
