const Navbar = () => {
  return (
    <nav className="bg-none fixed top-env(safe-area-inset-top) text-white p-4 h-12 flex justify-between items-center w-full">
      <div className="flex items-center gap-1.5">
        <img src="/app-logo.png" alt="logo" className="h-6" />
        <p className="text-lg font-semibold">Paper Brain</p>
      </div>
      <span className="text-sm text-gray-300"></span>
    </nav>
  );
};

export default Navbar;
