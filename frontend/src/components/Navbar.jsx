import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 fixed top-0 text-white p-4 h-12 flex justify-between items-center w-full">
      <p className="text-base font-semibold">Paper Brain</p>
      <span className="text-sm text-gray-300">Chat with your documents</span>
    </nav>
  );
};

export default Navbar;
