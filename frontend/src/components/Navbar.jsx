import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold">InsightAI</h1>
      <span className="text-sm text-gray-300">Chat with your documents 🤖</span>
    </nav>
  );
};

export default Navbar;
