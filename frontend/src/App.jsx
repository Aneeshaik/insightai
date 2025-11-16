import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <div className="flex flex-col w-full" style={{ minHeight: '100dvh' }}>
      <Navbar />
      <div className="flex-1 flex justify-center pt-4">
        <Home />
      </div>
    </div>
  );
}

export default App;
