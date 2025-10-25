import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Home />
      </div>
    </div>
  );
}

export default App;
