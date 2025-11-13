import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-none sticky top-0 md:fixed md:top-0 text-white p-4 h-12 flex justify-between items-center w-full z-50">
      <p className="text-lg font-semibold">Paper Brain</p>
      <span className="text-sm text-gray-300">Chat with your documents</span>
    </nav>
  );
};

export default Navbar;
