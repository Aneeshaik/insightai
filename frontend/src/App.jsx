import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screenflex flex-col w-full">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <Home />
      </div>
    </div>
  );
}

export default App;
